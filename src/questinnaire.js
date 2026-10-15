const inquirer = require('inquirer');
const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');

const NAME_RE = /^[a-zA-Z0-9][a-zA-Z0-9-_]*$/;
const DEFAULTS = { css: 'css', kanban: true, git: true };

function validate_name_sync(input) {
  if (!input || input.length > 50 || !NAME_RE.test(input)) {
    return 'Le nom du projet doit commencer par une lettre ou un chiffre et ne contenir que des lettres, chiffres, tirets ou underscores (50 caractères max).';
  }
  return true;
}

/** Renvoie un message d'erreur, ou null si le nom est utilisable. */
async function name_error(input, cwd = process.cwd()) {
  const sync = validate_name_sync(input);
  if (sync !== true) return sync;
  const exists = await fs
    .access(path.join(cwd, input))
    .then(() => true)
    .catch(() => false);
  return exists
    ? `Le dossier "${input}" existe déjà. Choisissez un autre nom ou changez de répertoire.`
    : null;
}

/**
 * Pose les questions manquantes. Tout ce qui est déjà fourni dans `preset`
 * (arguments ou options de la ligne de commande) n'est pas redemandé ;
 * avec `yes`, les valeurs par défaut sont utilisées.
 */
async function prompt_user(preset = {}) {
  const name = preset.project_name || process.env.GERMIN_PROJECT_NAME;
  const yes = Boolean(preset.yes);
  const answers = {};

  if (name) {
    const error = await name_error(name);
    if (error) throw new Error(error);
    answers.project_name = name;
  } else if (yes) {
    const error = await name_error('mon-projet');
    if (error) throw new Error(error);
    answers.project_name = 'mon-projet';
  }

  const questions = [];
  if (!answers.project_name) {
    questions.push({
      type: 'input',
      name: 'project_name',
      message: chalk.cyan('📝 Nom du projet :'),
      default: 'mon-projet',
      validate: async (input) => (await name_error(input)) || true,
    });
  }
  if (preset.css === undefined && !yes) {
    questions.push({
      type: 'list',
      name: 'css',
      message: chalk.cyan('🎨 Style de la page :'),
      choices: [
        { name: 'CSS pur (recommandé pour apprendre)', value: 'css' },
        { name: 'Bootstrap (composants prêts à l’emploi)', value: 'bootstrap' },
      ],
    });
  }
  if (preset.kanban === undefined && !yes) {
    questions.push({
      type: 'confirm',
      name: 'kanban',
      message: chalk.cyan('📋 Ajouter un tableau Kanban ?'),
      default: true,
    });
  }
  if (preset.git === undefined && !yes) {
    questions.push({
      type: 'confirm',
      name: 'git',
      message: chalk.cyan('🐙 Initialiser git (nécessaire pour déployer) ?'),
      default: true,
    });
  }

  const asked = questions.length ? await inquirer.prompt(questions) : {};
  const css = preset.css ?? asked.css ?? DEFAULTS.css;
  if (!['css', 'bootstrap'].includes(css)) {
    throw new Error('Option --css invalide : choisissez "css" ou "bootstrap".');
  }
  return {
    ...answers,
    ...asked,
    css,
    kanban: preset.kanban ?? asked.kanban ?? DEFAULTS.kanban,
    git: preset.git ?? asked.git ?? DEFAULTS.git,
  };
}

module.exports = { prompt_user, name_error, validate_name_sync };
