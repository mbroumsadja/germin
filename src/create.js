const fs = require('fs/promises');
const path = require('path');
const chalk = require('chalk');
const figlet = require('figlet');
const pkg = require('../package.json');
const { check_requisites } = require('./utils');
const { prompt_user } = require('./questinnaire');
const { generate_project } = require('./generate');

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

function print_next_steps(name, result) {
  console.log(chalk.green(`\n🎉 Félicitations, ${name} est créé !`));
  console.log(chalk.cyan('\nProchaines étapes :'));
  console.log(`1. cd ${name}`);
  console.log('2. npm install');
  console.log('3. npm run dev   → http://localhost:5173');
  if (result.kanban) console.log('4. germin kanban → ton tableau de tâches');
  console.log(
    `${result.kanban ? 5 : 4}. germin deploy → mettre ton site en ligne sur GitHub Pages`
  );
}

/**
 * Crée un projet. `preset` peut contenir project_name, css, kanban, git, yes.
 * @returns {Promise<{project_path:string, project_name:string, css:string, kanban:boolean, git:boolean}>}
 */
async function create_project(preset = {}) {
  let project_path = '';
  check_requisites();
  if (process.env.NODE_ENV !== 'test') {
    console.log(
      chalk.yellowBright(
        figlet.textSync(`Germin ${pkg.version}`, { font: 'Ghost' })
      )
    );
  }
  const answers = await prompt_user(preset);
  const { project_name } = answers;
  project_path = path.join(process.cwd(), project_name);
  try {
    const result = await generate_project({ project_path, ...answers });
    print_next_steps(project_name, result);
    return { project_path, project_name, ...result };
  } catch (error) {
    await clean_up_on_error(project_path);
    throw error;
  }
}

module.exports = { create_project };
