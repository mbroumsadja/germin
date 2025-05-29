const inquirer = require('inquirer');
const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');

async function prompt_user() {
  const questions = [
    process.env.GERMIN_PROJECT_NAME
      ? null
      : {
          type: 'input',
          name: 'project_name',
          message: chalk.cyan('📝 Entrez le nom du projet :'),
          default: 'mon-projet',
          validate: async (input) => {
            if (!/^[a-zA-Z0-9-_]+$/.test(input)) {
              return chalk.red(
                'Le nom du projet ne doit contenir que des lettres, chiffres, tirets ou underscores.'
              );
            }
            const exists = await fs
              .access(path.join(process.cwd(), input))
              .then(() => true)
              .catch(() => false);
            return exists
              ? chalk.red(`Le dossier "${input}" existe déjà.`)
              : true;
          },
        },
    {
      type: 'list',
      name: 'project_type',
      message: chalk.cyan('🌐 Quel type de projet voulez-vous créer ?'),
      choices: ['Statique (HTML/CSS)', 'JavaScript/TypeScript'],
      default: 'Statique (HTML/CSS)',
    },
    {
      type: 'list',
      name: 'js_type',
      message: chalk.cyan('⚙️ Voulez-vous utiliser JavaScript ou TypeScript ?'),
      choices: ['JavaScript', 'TypeScript'],
      when: (answers) => answers.project_type === 'JavaScript/TypeScript',
    },
    {
      type: 'list',
      name: 'css_framework',
      message: chalk.cyan('🎨 Quel framework CSS voulez-vous utiliser ?'),
      choices: ['CSS pur', 'Bootstrap'],
      default: 'CSS pur',
    },
    {
      type: 'confirm',
      name: 'include_assets',
      message: chalk.cyan(
        '🖼️ Voulez-vous inclure un dossier pour les images (public/assets/images) ?'
      ),
      default: false,
    },
    {
      type: 'confirm',
      name: 'include_pages',
      message: chalk.cyan(
        '📄 Voulez-vous utiliser plusieurs pages HTML (public/pages) ?'
      ),
      default: false,
    },
    {
      type: 'confirm',
      name: 'init_git',
      message: chalk.cyan('📚 Voulez-vous initialiser un dépôt Git ?'),
      default: false,
    },
    {
      type: 'confirm',
      name: 'github_repo',
      message: chalk.cyan('🌍 Voulez-vous créer un dépôt GitHub ?'),
      default: false,
      when: (answers) => answers.init_git,
    },
  ].filter(Boolean); // Supprimer les questions nulles (par exemple, project_name si fourni)

  const answers = await inquirer.prompt(questions);
  // Si le nom du projet est fourni via la ligne de commande, l'ajouter aux réponses
  if (process.env.GERMIN_PROJECT_NAME) {
    answers.project_name = process.env.GERMIN_PROJECT_NAME;
  }
  return answers;
}

module.exports = { prompt_user };
