const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const inquirer = require('inquirer');
const ora = require('ora');
const chalk = require('chalk');
const figlet = require('figlet');
const TEMPLATES = require('./templates');
const { checkPrerequisites } = require('./utils');

const execAsync = util.promisify(exec);

// Constantes pour les chemins
const PATHS = {
  public: 'public',
  css: 'public/css',
  js: 'public/js',
  index: 'index.html',
  style: 'public/css/style.css',
  script: 'public/js/script.js',
  readme: 'README.md',
  todo: 'TODO.md',
  gitignore: '.gitignore',
};

/**
 * Demande les informations à l'utilisateur via inquirer.
 * @returns {Promise<Object>} Réponses de l'utilisateur.
 */
async function promptUser() {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Entrez le nom du projet :',
      default: 'mon-projet',
      validate: async (input) => {
        if (!/^[a-zA-Z0-9-_]+$/.test(input)) {
          return 'Le nom du projet ne doit contenir que des lettres, chiffres, tirets ou underscores.';
        }
        const exists = await fs
          .access(path.join(process.cwd(), input))
          .then(() => true)
          .catch(() => false);
        return exists ? `Le dossier "${input}" existe déjà.` : true;
      },
    },
    {
      type: 'confirm',
      name: 'includeJs',
      message: 'Voulez-vous inclure un fichier JavaScript (script.js) ?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'initGit',
      message: 'Voulez-vous initialiser un dépôt Git ?',
      default: false,
    },
    {
      type: 'confirm',
      name: 'githubRepo',
      message: 'Voulez-vous créer un dépôt GitHub et le configurer ?',
      default: false,
      when: (answers) => answers.initGit,
    },
  ]);
}

/**
 * Crée les répertoires du projet.
 * @param {string} projectPath - Chemin du projet.
 * @param {boolean} includeJs - Inclure le dossier JS.
 */
async function createDirectories(projectPath, includeJs) {
  const spinner = ora('Création des répertoires...').start();
  try {
    await fs.mkdir(projectPath);
    await fs.mkdir(path.join(projectPath, PATHS.public));
    await fs.mkdir(path.join(projectPath, PATHS.css));
    if (includeJs) await fs.mkdir(path.join(projectPath, PATHS.js));
    spinner.succeed('Répertoires créés.');
  } catch (error) {
    spinner.fail('Échec de la création des répertoires.');
    if (error.code === 'EEXIST') {
      throw new Error(`Le dossier "${projectPath}" existe déjà.`);
    }
    throw error;
  }
}

/**
 * Crée les fichiers du projet.
 * @param {string} projectPath - Chemin du projet.
 * @param {string} projectName - Nom du projet.
 * @param {boolean} includeJs - Inclure le fichier JS.
 */
async function createFiles(projectPath, projectName, includeJs) {
  const spinner = ora('Création des fichiers...').start();
  const filePromises = [
    fs.writeFile(
      path.join(projectPath, PATHS.index),
      TEMPLATES.html(projectName, includeJs).trim()
    ),
    fs.writeFile(
      path.join(projectPath, PATHS.style),
      TEMPLATES.css(projectName).trim()
    ),
    fs.writeFile(
      path.join(projectPath, PATHS.readme),
      TEMPLATES.readme(projectName, includeJs).trim()
    ),
    fs.writeFile(
      path.join(projectPath, PATHS.todo),
      TEMPLATES.todo(includeJs).trim()
    ),
  ];
  if (includeJs) {
    filePromises.push(
      fs.writeFile(
        path.join(projectPath, PATHS.script),
        TEMPLATES.js(projectName).trim()
      )
    );
  }
  try {
    await Promise.all(filePromises);
    spinner.succeed('Fichiers créés.');
  } catch (error) {
    spinner.fail('Échec de la création des fichiers.');
    throw error;
  }
}

/**
 * Crée le fichier package.json et installe les dépendances.
 * @param {string} projectPath - Chemin du projet.
 * @param {string} projectName - Nom du projet.
 */
async function createPackageJson(projectPath, projectName) {
  const packageJson = {
    name: projectName,
    version: '1.0.0',
    description: `Projet généré pour ${projectName} par Germin`,
    scripts: {
      dev: 'live-server . --port=8080',
    },
    devDependencies: {
      'live-server': '^1.2.2',
    },
  };
  await fs.writeFile(
    path.join(projectPath, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  const spinner = ora('Installation des dépendances...').start();
  try {
    await execAsync('npm install', { cwd: projectPath });
    spinner.succeed('Dépendances installées.');
  } catch (error) {
    spinner.fail("Échec de l'installation des dépendances.");
    throw error;
  }
}

/**
 * Initialise le dépôt Git et configure GitHub si demandé.
 * @param {string} projectPath - Chemin du projet.
 * @param {boolean} githubRepo - Créer un dépôt GitHub.
 */
async function initializeGit(projectPath, githubRepo) {
  const spinner = ora('Initialisation de Git...').start();
  try {
    await execAsync('git init', { cwd: projectPath });
    await fs.writeFile(
      path.join(projectPath, PATHS.gitignore),
      TEMPLATES.gitignore
    );
    spinner.succeed('Dépôt Git initialisé.');
  } catch (error) {
    spinner.fail("Échec de l'initialisation de Git.");
    throw error;
  }

  if (githubRepo) {
    console.log(chalk.yellow('Pour créer un dépôt GitHub :'));
    console.log('1. Créez un dépôt sur GitHub sans README ni .gitignore.');
    console.log('2. Exécutez ces commandes dans le dossier du projet :');
    console.log(`   git add .`);
    console.log(`   git commit -m "Initial commit"`);
    console.log(`   git remote add origin <URL_DU_DEPOT_GITHUB>`);
    console.log(`   git push -u origin main`);
  }
}

/**
 * Supprime le dossier du projet en cas d'erreur.
 * @param {string} projectPath - Chemin du projet.
 */
async function cleanupOnError(projectPath) {
  try {
    await fs.rm(projectPath, { recursive: true, force: true });
    console.log(
      chalk.yellow(`Dossier "${projectPath}" supprimé suite à une erreur.`)
    );
  } catch (error) {
    console.error(chalk.red(`Erreur lors du nettoyage : ${error.message}`));
  }
}

/**
 * Crée un nouveau projet web.
 */
async function createProject() {
  let projectPath = '';
  try {
    checkPrerequisites();
    // Afficher "Germin" en ASCII art
    console.log(chalk.blue(figlet.textSync('Germin', { font: 'Standard' })));
    console.log(chalk.cyan('Générateur de projet web statique v1.0.0\n'));

    const answers = await promptUser();
    const { projectName, includeJs, initGit, githubRepo } = answers;
    projectPath = path.join(process.cwd(), projectName);

    await createDirectories(projectPath, includeJs);
    await createFiles(projectPath, projectName, includeJs);
    await createPackageJson(projectPath, projectName);
    if (initGit) await initializeGit(projectPath, githubRepo);

    console.log(
      chalk.green(
        `\nProjet "${projectName}" créé avec succès dans ${projectPath} !`
      )
    );
    console.log(chalk.cyan('Prochaines étapes :'));
    console.log(`1. cd ${projectName}`);
    console.log('2. npm dev');
    console.log('Consultez le README.md pour plus de détails.');
  } catch (error) {
    if (projectPath) await cleanupOnError(projectPath);
    throw error;
  }
}

module.exports = { createProject };
