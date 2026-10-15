const fs = require('fs').promises;
const path = require('path');
const ora = require('ora');
const { PATHS } = require('./path');

async function create_directories(project_path) {
  const spinner = ora('').start();
  try {
    await fs.mkdir(project_path, { recursive: true });
    await fs.mkdir(path.join(project_path, PATHS.public));
    spinner.succeed(`📕 Dossier ${PATHS.public} crée .`);
    await fs.mkdir(path.join(project_path, PATHS.x));
    spinner.succeed(`📕 Dossier ${PATHS.x} crée .`);
    await fs.mkdir(path.join(project_path, PATHS.css));
    spinner.succeed(`📕 Dossier ${PATHS.css} crée .`);
    await fs.mkdir(path.join(project_path, PATHS.js));
    spinner.succeed(`📕 Dossier ${PATHS.js} crée .`);
    await fs.mkdir(path.join(project_path, PATHS.pages), { recursive: true });
    spinner.succeed(`📕 Dossier ${PATHS.pages} crée .`);
    await fs.mkdir(path.join(project_path, PATHS.assets, 'images'), {
      recursive: true,
    });
    spinner.succeed(`📕 ${PATHS.assets} crée .\n`);
    spinner.succeed('Dossier crée avec succès.\n');
  } catch (error) {
    spinner.fail('échec de la création des répertoires.', error);
    throw error;
  }
}

module.exports = { create_directories };
