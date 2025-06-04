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
      choices: ['statique HTML', 'statique HTML/CSS', 'statique HTML/CSS/JS'],
      default: 'statique HTML',
    },
    {
      type: 'list',
      name: 'js_type',
      message: chalk.cyan('⚙️ Voulez-vous allez faire du Javascript ?'),
      choices: ['javascript', 'javascript/ASYNC', 'javascript/FETCH'],
      when: (answers) => answers.project_type === 'statique HTML/CSS/JS',
    },
    {
      type: 'list',
      name: 'css_framework',
      message: chalk.cyan('🎨 Quel framework CSS voulez-vous utiliser ?'),
      choices: ['style sheet cascading (CSS)', 'framework (Bootstrap)'],
      default: 'style sheet cascading (CSS)',
      when: (answers) =>
        answers.project_type === 'statique HTML/CSS/JS' ||
        answers.project_type === 'statique HTML/CSS',
    },
    {
      type: 'checkbox',
      name: 'optionel',
      message: 'Choisir une ou plusieurs options :',
      choices: [
        'pages (public/pages)',
        'images (public/assets/images)',
        'initialiser git (git init)',
        'créer un dépot github (<URL>)',
      ],
      default: [],
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
