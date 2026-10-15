const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');
const inquirer = require('inquirer');

const WORKFLOW_PATH = path.join('.github', 'workflows', 'deploy.yml');

// Versions vérifiées en octobre 2026 pour les actions Pages ; checkout/setup-node en v4 (stables).
const WORKFLOW = `name: Déployer sur GitHub Pages

on:
  push:
    branches: [main, master]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm install
      - run: npm run build
      - uses: actions/configure-pages@v6
      - uses: actions/upload-pages-artifact@v5
        with:
          path: dist
      - id: deployment
        uses: actions/deploy-pages@v5
`;

function default_run(cmd, { cwd } = {}) {
  try {
    const out = execSync(cmd, {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return (out || '').trim();
  } catch (e) {
    const message =
      String(e.stderr || e.stdout || e.message || '').trim() || e.message;
    const error = new Error(message);
    error.stderr = message;
    throw error;
  }
}

const default_ask = {
  confirm: async (message) =>
    (
      await inquirer.prompt([
        { type: 'confirm', name: 'ok', message, default: true },
      ])
    ).ok,
  input: async (message, validate) =>
    (
      await inquirer.prompt([
        { type: 'input', name: 'value', message, validate },
      ])
    ).value.trim(),
};

/** Extrait { user, repo } d'une adresse de dépôt GitHub (https ou ssh), sinon null. */
function parse_github_remote(url) {
  const m =
    /^(?:https?:\/\/(?:[^@/\s]+@)?github\.com\/|git@github\.com:|ssh:\/\/git@github\.com\/)([A-Za-z0-9-_.]+)\/([A-Za-z0-9-_.]+?)(?:\.git)?\/?$/.exec(
      String(url).trim()
    );
  return m ? { user: m[1], repo: m[2] } : null;
}

function pages_url({ user, repo }) {
  return repo.toLowerCase() === `${user.toLowerCase()}.github.io`
    ? `https://${user}.github.io/`
    : `https://${user}.github.io/${repo}/`;
}

/** Traduit les erreurs git/npm les plus fréquentes en conseils pour débutants. */
function explain_failure(stderr) {
  const s = String(stderr);
  const rules = [
    [
      /vite: not found|Cannot find module.*vite|command not found: vite|'vite' is not recognized/i,
      "Vite n'est pas installé : lance « npm install » dans ton projet.",
    ],
    [
      /Please tell me who you are|user\.(name|email)|empty ident/i,
      'Git ne sait pas qui tu es. Configure-le une fois :\n    git config --global user.name "Ton Nom"\n    git config --global user.email "ton@email.com"',
    ],
    [
      /Authentication failed|could not read Username|Permission denied|publickey|403|invalid credentials/i,
      "GitHub refuse ton identité. Le plus simple : installe GitHub CLI (https://cli.github.com) puis lance « gh auth login ». Sinon, utilise un jeton d'accès personnel à la place du mot de passe.",
    ],
    [
      /Repository not found|does not appear to be a git repository|remote: Not Found|returned error: 404/i,
      "Le dépôt GitHub est introuvable : vérifie l'adresse (pseudo/nom) et qu'il existe bien (https://github.com/new).",
    ],
    [
      /non-fast-forward|rejected|fetch first|failed to push/i,
      "Le dépôt GitHub contient des changements que tu n'as pas en local. Récupère-les avec « git pull --rebase » puis relance le déploiement.",
    ],
    [
      /Could not resolve host|ENOTFOUND|ETIMEDOUT|network|unable to access/i,
      'Pas de connexion à Internet (ou GitHub est injoignable). Vérifie ta connexion puis réessaie.',
    ],
    [
      /not a git repository/i,
      "Ce dossier n'est pas un dépôt git : lance « git init » ou laisse Germin le faire.",
    ],
  ];
  const hit = rules.find(([re]) => re.test(s));
  return hit
    ? hit[1]
    : 'Copie le message d\'erreur ci-dessus dans : germin explain "<message>" — le tuteur te l\'expliquera.';
}

function tail(text, n = 8) {
  return String(text).split('\n').filter(Boolean).slice(-n).join('\n');
}

/**
 * Déploiement guidé sur GitHub Pages.
 * - par défaut : build local puis publication de dist/ sur la branche gh-pages ;
 * - avec `auto` : génère un workflow GitHub Actions qui déploie à chaque push.
 */
async function deploy({
  project_path,
  run = default_run,
  ask = default_ask,
  out = console.log,
  yes = false,
  auto = false,
}) {
  const sh = (cmd) => run(cmd, { cwd: project_path });
  const can = (cmd) => {
    try {
      sh(cmd);
      return true;
    } catch {
      return false;
    }
  };
  const total = auto ? 5 : 7;
  let n = 0;
  const step = (text) => out(chalk.cyan(`\n[${++n}/${total}] ${text}`));
  const attempt = (label, fn) => {
    try {
      return fn();
    } catch (error) {
      out(chalk.red(`\n✖ Échec : ${label}`));
      out(chalk.gray(tail(error.stderr || error.message)));
      out(
        chalk.yellow(`\n💡 ${explain_failure(error.stderr || error.message)}`)
      );
      throw new Error(`Déploiement interrompu (${label}).`);
    }
  };
  const confirm = async (message) => (yes ? true : ask.confirm(message));

  // 0. projet valide
  const pkg_file = path.join(project_path, 'package.json');
  if (
    !fs.existsSync(pkg_file) ||
    !JSON.parse(fs.readFileSync(pkg_file, 'utf8')).scripts?.build
  ) {
    throw new Error(
      'Ce dossier ne ressemble pas à un projet Germin (package.json avec un script « build » introuvable).'
    );
  }
  const name = (() => {
    try {
      return JSON.parse(
        fs.readFileSync(path.join(project_path, 'germin.json'), 'utf8')
      ).nom;
    } catch {
      return path.basename(project_path);
    }
  })();

  // 1. git
  step('Vérification de git');
  if (!can('git --version'))
    throw new Error(
      "Git n'est pas installé : télécharge-le sur https://git-scm.com puis relance « germin deploy »."
    );
  if (!can('git rev-parse --is-inside-work-tree')) {
    if (
      !(await confirm(
        "Ce dossier n'est pas encore un dépôt git. Lancer « git init » ?"
      ))
    )
      throw new Error('Déploiement annulé : un dépôt git est nécessaire.');
    attempt('git init', () => sh('git init'));
    out('  ✓ dépôt git créé');
  } else {
    out('  ✓ dépôt git présent');
  }

  // 2. commit
  step('Enregistrement de ton travail');
  const has_commit = can('git rev-parse HEAD');
  const dirty = (() => {
    try {
      return sh('git status --porcelain').length > 0;
    } catch {
      return true;
    }
  })();
  if (!has_commit || dirty) {
    if (await confirm('Enregistrer ton travail (git add + git commit) ?')) {
      attempt('git commit', () => {
        sh('git add -A');
        sh('git commit -m "Mise à jour avec Germin"');
      });
      out('  ✓ travail enregistré (commit)');
    } else if (!has_commit) {
      throw new Error('Déploiement annulé : il faut au moins un commit.');
    }
  } else {
    out('  ✓ rien de nouveau à enregistrer');
  }

  // 3. dépôt distant
  step('Dépôt GitHub (origin)');
  let remote = '';
  try {
    remote = sh('git remote get-url origin');
  } catch {
    remote = '';
  }
  if (!remote) {
    if (
      can('gh auth status') &&
      (await confirm(
        `Créer le dépôt public « ${name} » sur ton compte GitHub (avec GitHub CLI) ?`
      ))
    ) {
      attempt('création du dépôt GitHub', () =>
        sh(`gh repo create ${name} --public --source=. --remote=origin`)
      );
      remote = sh('git remote get-url origin');
    } else if (yes) {
      throw new Error(
        'Aucun dépôt GitHub (origin) configuré. Crée un dépôt vide sur https://github.com/new puis lance : git remote add origin <adresse> && germin deploy'
      );
    } else {
      out("  Crée d'abord un dépôt VIDE et PUBLIC sur https://github.com/new");
      remote = await ask.input(
        'Colle ici son adresse (ex. https://github.com/pseudo/mon-site.git) :',
        (v) =>
          parse_github_remote(v)
            ? true
            : 'Adresse GitHub invalide (https://github.com/pseudo/nom ou git@github.com:pseudo/nom.git).'
      );
      if (!parse_github_remote(remote))
        throw new Error('Adresse GitHub invalide.');
      attempt('ajout du dépôt distant', () =>
        sh(`git remote add origin ${remote}`)
      );
    }
  }
  out(`  ✓ origin : ${remote}`);
  const target = parse_github_remote(remote);

  if (auto) {
    // 4. workflow
    step('Création du workflow GitHub Actions');
    const file = path.join(project_path, WORKFLOW_PATH);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, WORKFLOW);
    out(`  ✓ ${WORKFLOW_PATH}`);
    attempt('git commit du workflow', () => {
      sh('git add -A');
      if (sh('git status --porcelain').length)
        sh('git commit -m "Ajout du déploiement automatique GitHub Pages"');
    });
    // 5. push
    step('Envoi sur GitHub');
    attempt('git push', () => sh('git push -u origin HEAD'));
    out('  ✓ code envoyé');
    out(chalk.green('\n🎉 Déploiement automatique configuré !'));
    out(
      'À faire une seule fois sur GitHub : Settings → Pages → Source : « GitHub Actions ».'
    );
    if (target) {
      out(
        `Suivi des déploiements : https://github.com/${target.user}/${target.repo}/actions`
      );
      out(`Ton site : ${pages_url(target)}`);
    }
    out('Ensuite, chaque « git push » met ton site à jour tout seul.');
    return { auto: true, url: target ? pages_url(target) : null };
  }

  // 4. envoi du code source
  step('Envoi de ton code sur GitHub');
  attempt('git push', () => sh('git push -u origin HEAD'));
  out('  ✓ code source envoyé');

  // 5. dépendances
  step('Dépendances');
  if (!fs.existsSync(path.join(project_path, 'node_modules'))) {
    attempt('npm install', () => sh('npm install'));
    out('  ✓ dépendances installées');
  } else {
    out('  ✓ déjà installées');
  }

  // 6. build
  step('Construction du site (npm run build)');
  attempt('npm run build', () => sh('npm run build'));
  out('  ✓ dossier dist/ prêt');

  // 7. publication
  step('Publication sur la branche gh-pages');
  attempt('publication gh-pages', () => sh('npx --yes gh-pages -d dist'));
  out('  ✓ site publié');

  out(chalk.green('\n🎉 Ton site est en ligne !'));
  if (target) out(`Adresse : ${pages_url(target)}`);
  else out('Adresse : https://<ton-pseudo>.github.io/<nom-du-depot>/');
  out(
    'Première fois ? Sur GitHub : Settings → Pages → Source : « Deploy from a branch » → branche gh-pages, dossier / (root).'
  );
  out(
    'La page peut mettre 1 à 2 minutes à apparaître : une 404 juste après est normale.'
  );
  return { auto: false, url: target ? pages_url(target) : null };
}

module.exports = {
  deploy,
  parse_github_remote,
  pages_url,
  explain_failure,
  WORKFLOW,
  WORKFLOW_PATH,
};
