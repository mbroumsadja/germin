const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora');
const { ask_claude, get_config, extract_json, IaError } = require('./ia');
const {
  TUTOR_SYSTEM,
  EXPLAIN_SYSTEM,
  REVIEW_SYSTEM,
  PLAN_SYSTEM,
  QUIZ_SYSTEM,
} = require('./prompts');
const { run_tests } = require('./runner');
const { read_progress, record_hint, record_quiz } = require('./progress');
const { read_tasks, write_tasks } = require('./tasks');

const MAX_FILE_CHARS = 6000;
const DEFAULT_CODE_FILES = ['public/js/script.js', 'index.html'];
const PRIVACY_NOTE =
  "ℹ️  Ton code est envoyé à l'API Anthropic pour générer la réponse.";

async function with_spinner(text, fn) {
  if (!process.stdout.isTTY || process.env.NODE_ENV === 'test') return fn();
  const spinner = ora(text).start();
  try {
    return await fn();
  } finally {
    spinner.stop();
  }
}

function read_limited(project_path, rel) {
  const file = path.join(project_path, rel);
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) return null;
  const text = fs.readFileSync(file, 'utf8');
  return text.length > MAX_FILE_CHARS
    ? `${text.slice(0, MAX_FILE_CHARS)}\n… (tronqué)`
    : text;
}

function code_block(project_path, files) {
  return files
    .map((rel) => ({ rel, text: read_limited(project_path, rel) }))
    .filter((f) => f.text !== null)
    .map((f) => `// fichier : ${f.rel}\n${f.text}`)
    .join('\n\n');
}

function consignes_of(project_path) {
  return read_limited(project_path, 'CONSIGNES.md') || '(pas de consignes)';
}

/** Indice progressif : niveau 1 → 3, au fil des demandes. Repli hors ligne si besoin. */
async function hint_command({
  project_path,
  niveau,
  only,
  config = get_config(),
  fetch_impl,
  out = console.log,
}) {
  const results = await run_tests(project_path, { only });
  if (!results)
    throw new Error(
      "Pas de dossier tests/ : « germin hint » s'utilise dans un projet guidé (germin new <exemple>)."
    );
  const failing = results.filter((r) => !r.ok);
  if (!failing.length) {
    out(
      chalk.green(
        "🎉 Tous tes tests passent : tu n'as pas besoin d'indice ! Pense à germin deploy."
      )
    );
    return { done: true };
  }
  const target = failing[0];
  const asked = read_progress(project_path).hints[target.id] || 0;
  const level = Math.min(3, Math.max(1, Number(niveau) || asked + 1));
  record_hint(project_path, target.id);

  const offline_text = target.indices[level - 1] || target.message;
  const header = chalk.cyan(`\n💡 Indice ${level}/3 — ${target.titre}\n`);

  if (!config.api_key) {
    out(header + offline_text);
    out(
      chalk.gray(
        "\n(Indice hors ligne. Avec une clé API, le tuteur Claude s'adapte à ton code : voir « germin explain --help ».)"
      )
    );
    return { level, text: offline_text, offline: true, test: target.id };
  }

  const files = target.fichiers.length ? target.fichiers : DEFAULT_CODE_FILES;
  const prompt = [
    `Niveau d'aide demandé : ${level}`,
    `<consignes>\n${consignes_of(project_path)}\n</consignes>`,
    `<test>\nTest en échec : ${target.titre}\nMessage : ${target.message}\n</test>`,
    `<code_eleve>\n${code_block(project_path, files)}\n</code_eleve>`,
  ].join('\n\n');
  try {
    if (config.api_key) out(chalk.gray(PRIVACY_NOTE)); // rien n'est envoyé sans clé
    const text = await with_spinner('Le tuteur réfléchit…', () =>
      ask_claude({
        system: TUTOR_SYSTEM,
        prompt,
        config,
        fetch_impl: fetch_impl || fetch,
      })
    );
    out(header + text);
    return { level, text, offline: false, test: target.id };
  } catch (error) {
    if (error instanceof IaError && error.offline) {
      out(chalk.yellow(`\n⚠️  ${error.message} Voici l'indice hors ligne :`));
      out(header + offline_text);
      return { level, text: offline_text, offline: true, test: target.id };
    }
    throw error;
  }
}

/** Explique un message d'erreur (ou d'échec de déploiement) en français simple. */
async function explain_command({
  message,
  fichier,
  cwd = process.cwd(),
  config = get_config(),
  fetch_impl,
  out = console.log,
}) {
  if (!message || !message.trim()) {
    throw new Error(
      'Donne le message d\'erreur à expliquer : germin explain "Cannot read properties of undefined" [--fichier public/js/script.js]'
    );
  }
  const prompt = [
    `<erreur>\n${message.slice(0, 3000)}\n</erreur>`,
    fichier
      ? `<code_eleve>\n${code_block(cwd, [fichier]) || '(fichier introuvable)'}\n</code_eleve>`
      : '',
  ]
    .filter(Boolean)
    .join('\n\n');
  if (config.api_key) out(chalk.gray(PRIVACY_NOTE)); // rien n'est envoyé sans clé
  const text = await with_spinner("Analyse de l'erreur…", () =>
    ask_claude({
      system: EXPLAIN_SYSTEM,
      prompt,
      config,
      fetch_impl: fetch_impl || fetch,
    })
  );
  out(`\n🔎 ${text}`);
  return { text };
}

/** Relecture bienveillante d'un fichier (3 remarques maximum). */
async function review_command({
  project_path,
  fichier = 'public/js/script.js',
  config = get_config(),
  fetch_impl,
  out = console.log,
}) {
  const code = code_block(project_path, [fichier]);
  if (!code) throw new Error(`Fichier introuvable : ${fichier}`);
  if (config.api_key) out(chalk.gray(PRIVACY_NOTE)); // rien n'est envoyé sans clé
  const text = await with_spinner('Relecture en cours…', () =>
    ask_claude({
      system: REVIEW_SYSTEM,
      prompt: `<code_eleve>\n${code}\n</code_eleve>`,
      config,
      fetch_impl: fetch_impl || fetch,
    })
  );
  out(`\n🧐 ${text}`);
  return { text };
}

/** Découpe une idée de projet en cartes Kanban ajoutées à x/task.json. */
async function plan_command({
  project_path,
  idee,
  config = get_config(),
  fetch_impl,
  out = console.log,
}) {
  if (!idee || !idee.trim())
    throw new Error('Décris ton idée : germin plan "un site de recettes"');
  if (!fs.existsSync(path.join(project_path, 'x'))) {
    throw new Error(
      "Ce projet n'a pas de Kanban : lance d'abord « germin add »."
    );
  }
  const text = await with_spinner('Découpage en tâches…', () =>
    ask_claude({
      system: PLAN_SYSTEM,
      prompt: `Idée de projet : ${idee.slice(0, 500)}`,
      max_tokens: 900,
      config,
      fetch_impl: fetch_impl || fetch,
    })
  );
  const raw = extract_json(text, '[');
  const cards = raw
    .filter((c) => c && typeof c.title === 'string' && c.title.trim())
    .slice(0, 8)
    .map((c) => ({
      title: c.title.trim().slice(0, 200),
      description:
        typeof c.description === 'string'
          ? c.description.trim().slice(0, 2000)
          : '',
      label: 'todo',
      time: 0,
    }));
  if (!cards.length)
    throw new IaError(
      "L'IA n'a proposé aucune tâche exploitable : reformule ton idée."
    );
  const tasks = read_tasks(project_path);
  write_tasks(project_path, [...tasks, ...cards]);
  out(chalk.green(`\n📋 ${cards.length} tâches ajoutées au Kanban :`));
  cards.forEach((c, i) => out(`  ${i + 1}. ${c.title}`));
  out(chalk.cyan('\nOuvre-les avec : germin kanban'));
  return { added: cards.length };
}

const default_ask = async (q) => {
  const { choix } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choix',
      message: q.question,
      choices: q.options.map((o, i) => ({ name: o, value: i })),
    },
  ]);
  return choix;
};

/** Quiz de compréhension (5 QCM) généré à partir du projet de l'élève. */
async function quiz_command({
  project_path,
  config = get_config(),
  fetch_impl,
  out = console.log,
  ask = default_ask,
}) {
  const prompt = [
    `<consignes>\n${consignes_of(project_path)}\n</consignes>`,
    `<code_eleve>\n${code_block(project_path, DEFAULT_CODE_FILES)}\n</code_eleve>`,
  ].join('\n\n');
  if (config.api_key) out(chalk.gray(PRIVACY_NOTE)); // rien n'est envoyé sans clé
  const text = await with_spinner('Préparation du quiz…', () =>
    ask_claude({
      system: QUIZ_SYSTEM,
      prompt,
      max_tokens: 1500,
      config,
      fetch_impl: fetch_impl || fetch,
    })
  );
  const questions = (extract_json(text, '{').questions || [])
    .filter(
      (q) =>
        q &&
        typeof q.question === 'string' &&
        Array.isArray(q.options) &&
        q.options.length === 4 &&
        q.options.every((o) => typeof o === 'string') &&
        Number.isInteger(q.reponse) &&
        q.reponse >= 0 &&
        q.reponse < 4
    )
    .slice(0, 5);
  if (!questions.length)
    throw new IaError("Le quiz généré n'est pas exploitable : réessaie.");
  let score = 0;
  for (const q of questions) {
    const choix = await ask(q);
    if (choix === q.reponse) {
      score++;
      out(chalk.green('  ✓ Bonne réponse !'));
    } else {
      out(chalk.red(`  ✗ La bonne réponse était : ${q.options[q.reponse]}`));
    }
    if (q.explication) out(chalk.gray(`    ${q.explication}`));
  }
  record_quiz(project_path, score, questions.length);
  out(chalk.cyan(`\n🏁 Score : ${score}/${questions.length}`));
  return { score, total: questions.length };
}

module.exports = {
  hint_command,
  explain_command,
  review_command,
  plan_command,
  quiz_command,
};
