#!/usr/bin/env node
const { program } = require('commander');
const { create_project } = require('../src/create_project');
const chalk = require('chalk');
const figlet = require('figlet');
const ora = require('ora'); 

program
  .version('1.0.5')
  .description(
    chalk.cyan(
      `${figlet.textSync('Germin', { font: 'Ghost' })}`
    )
  );

program
  .command('create [project_name]')
  .description('Crée un nouveau projet web statique')
  .action(async (project_name) => {
    const spinner = ora(chalk.cyan('Initialisation de Germin...')).start();
    try {
      if (project_name) {
        // Valider le nom du projet
        if (!/^[a-zA-Z0-9-_]+$/.test(project_name)) {
          spinner.fail(
            chalk.red(
              'Le nom du projet ne doit contenir que des lettres, chiffres, tirets ou underscores.'
            )
          );
          process.exit(1);
        }
        const fs = require('fs').promises;
        const path = require('path');
        const exists = await fs
          .access(path.join(process.cwd(), project_name))
          .then(() => true)
          .catch(() => false);
        if (exists) {
          spinner.fail(chalk.red(`Le dossier "${project_name}" existe déjà.`));
          process.exit(1);
        }
        process.env.GERMIN_PROJECT_NAME = project_name;
      }
      spinner.succeed(chalk.blueBright('Prêt à créer votre projet !\n'));
      await create_project();
    } catch (error) {
      spinner.fail(chalk.red(`Erreur : ${error.message}`));
      process.exit(1);
    }
  });


program.parse(process.argv);
