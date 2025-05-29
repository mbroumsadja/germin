#!/usr/bin/env node
const { program } = require('commander');
const { create_project } = require('../src/create_project');
const chalk = require('chalk');
const figlet = require('figlet');
const ora = require('ora');

program
  .version('1.0.3')
  .description(
    chalk.cyan(
      `${figlet.textSync('Germin', { font: 'Ghost' })}\n\n` +
        'Créez des projets web statiques avec HTML, CSS, JS/TypeScript et une app Kanban.\n' +
        'Utilisez `germin create <nom>` pour un démarrage rapide ou `germin create` pour le mode interactif.'
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
      spinner.succeed(chalk.green('Prêt à créer votre projet !'));
      await create_project();
    } catch (error) {
      spinner.fail(chalk.red(`Erreur : ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('build')
  .description('Construit le projet pour la production')
  .action(async () => {
    const fs = require('fs').promises;
    const path = require('path');
    const spinner = ora(chalk.cyan('Construction du projet...')).start();
    const dist_path = path.join(process.cwd(), 'dist');
    try {
      await fs.rm(dist_path, { recursive: true, force: true });
      await fs.mkdir(dist_path);
      await fs.cp(
        path.join(process.cwd(), 'public'),
        path.join(dist_path, 'public'),
        { recursive: true }
      );
      await fs.copyFile(
        path.join(process.cwd(), 'index.html'),
        path.join(dist_path, 'index.html')
      );
      await fs.copyFile(
        path.join(process.cwd(), 'README.md'),
        path.join(dist_path, 'README.md')
      );
      spinner.succeed(chalk.green('Projet construit dans dist/.'));
    } catch (error) {
      spinner.fail(chalk.red(`Échec de la construction : ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('deploy')
  .description('Déploie sur GitHub Pages')
  .action(async () => {
    const { exec } = require('child_process');
    const util = require('util');
    const execAsync = util.promisify(exec);
    const spinner = ora(chalk.cyan('Déploiement sur GitHub Pages...')).start();
    try {
      await execAsync('npm install --save-dev gh-pages');
      await execAsync('npm run build');
      await execAsync('gh-pages -d dist');
      spinner.succeed(chalk.green('Projet déployé.'));
    } catch (error) {
      spinner.fail(chalk.red(`Échec du déploiement : ${error.message}`));
      process.exit(1);
    }
  });

program.parse(process.argv);
