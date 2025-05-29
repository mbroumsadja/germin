const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const ora = require('ora');
const chalk = require('chalk');
const figlet = require('figlet');
const inquirer = require('inquirer');
const TEMPLATES = require('./templates');
const { check_requisites } = require('./utils');
const { prompt_user } = require('./questionnaire');
const { create_directories } = require('./dossier');
const { create_file } = require('./fichier.js');
const { PATHS } = require('./path');
const execAsync = util.promisify(exec);

async function create_package_json(project_path, project_name, answers) {
  const { css_framework, js_type } = answers;
  const package_json = {
    name: project_name,
    version: '1.0.0',
    description: `${project_name} a été généré par Germin`,
    scripts: {
      dev: 'npx serve -l 8080 .',
      build: 'node trello/scripts/build.js',
      predeploy:
        'git remote get-url origin || (echo "Erreur : Configurez un remote origin avec git remote add origin <URL>" && exit 1)',
      deploy: 'gh-pages -d dist',
    },
    devDependencies: {
      'gh-pages': '^6.1.1',
      serve: '^14.2.1',
    },
    dependencies: {
      ...(css_framework === 'Bootstrap' && { bootstrap: '^5.3.3' }),
      ...(js_type === 'TypeScript' && { typescript: '^5.2.2' }),
    },
  };
  try {
    await fs.writeFile(
      path.join(project_path, 'package.json'),
      JSON.stringify(package_json, null, 2)
    );
    const spinner = ora(chalk.cyan('Installation des dépendances...')).start();
    await execAsync('npm install', { cwd: project_path });
    spinner.succeed(chalk.green('Dépendances installées.'));
  } catch (error) {
    console.error(
      chalk.red(`Erreur lors de la création de package.json : ${error.message}`)
    );
    throw error;
  }
}

async function initialise_git(project_path, answers) {
  const { init_git, github_repo } = answers;
  if (!init_git) return;

  const spinner = ora(chalk.cyan('Initialisation de Git...')).start();
  try {
    await execAsync('git init', { cwd: project_path });
    await fs.writeFile(
      path.join(project_path, PATHS.gitignore),
      TEMPLATES.gitignore
    );
    spinner.succeed(chalk.green('Dépôt Git initialisé.'));

    if (github_repo) {
      const githubQuestions = [
        {
          type: 'input',
          name: 'github_repo_url',
          message: chalk.cyan(
            'Entrez l`URL du dépôt GitHub (ex. https://github.com/<user>/<repo>.git) :'
          ),
          validate: (input) =>
            input.startsWith('https://github.com/')
              ? true
              : chalk.red('Veuillez entrer une URL GitHub valide.'),
        },
      ];
      const githubAnswers = await inquirer.prompt(githubQuestions);
      const repoUrl = githubAnswers.github_repo_url;

      await execAsync('git add .', { cwd: project_path });
      await execAsync('git commit -m "Initial commit"', { cwd: project_path });
      await execAsync(`git remote add origin ${repoUrl}`, {
        cwd: project_path,
      });
      spinner.succeed(chalk.green('Dépôt GitHub configuré.'));
      console.log(chalk.cyan('Pour pousser les changements vers GitHub :'));
      console.log(`   cd ${path.basename(project_path)}`);
      console.log('   git push -u origin main');
    }
  } catch (error) {
    spinner.fail(
      chalk.red(`Échec de l'initialisation de Git : ${error.message}`)
    );
    throw error;
  }
}

async function clean_up_on_error(project_path) {
  try {
    await fs.rm(project_path, { recursive: true, force: true });
    console.log(
      chalk.yellow(`Dossier "${project_path}" supprimé suite à une erreur.`)
    );
  } catch (error) {
    console.error(chalk.red(`Erreur lors du nettoyage : ${error.message}`));
  }
}

async function create_project() {
  let project_path = '';
  try {
    check_requisites();
    console.log(chalk.green(figlet.textSync('Germin', { font: 'Ghost' })));
    console.log(
      chalk.cyan(
        '🚀 Outil pour initier les débutants au développement web statique\n'
      )
    );

    const answers = await prompt_user();
    const { project_name, js_type, include_assets, include_pages } = answers;
    project_path = path.join(process.cwd(), project_name);

    await create_directories(
      project_path,
      js_type,
      include_assets,
      include_pages
    );
    await create_file(project_path, project_name, answers);
    await create_package_json(project_path, project_name, answers);
    await initialise_git(project_path, answers);

    console.log(
      chalk.green(
        `\n🎉 Projet "${project_name}" créé avec succès dans ${project_path} !`
      )
    );
    console.log(chalk.cyan('Prochaines étapes :'));
    console.log(`1. cd ${project_name}`);
    console.log('2. npm install');
    console.log('3. npm run dev');
    console.log(
      '4. Ouvrez http://localhost:8080 (ou http://localhost:8080/trello/app pour la gestion des tâches)'
    );
    console.log('Consultez le README.md pour plus de détails.');
  } catch (error) {
    if (project_path) await clean_up_on_error(project_path);
    console.error(chalk.red(`Erreur : ${error.message}`));
    throw error;
  }
}

module.exports = { create_project };
