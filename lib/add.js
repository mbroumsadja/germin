const fs = require('fs/promises');
const path = require('path');
const { PATHS } = require('../src/path');
const { write_kanban } = require('../src/generate');
const chalk = require('chalk');

/** Ajoute le Kanban (x/kanban.html + x/task.json) à un projet existant. */
async function add(project_name, project_path) {
  const x_dir = path.join(project_path, PATHS.x);
  const exists = await fs.access(x_dir).then(() => true).catch(() => false);
  if (exists) {
    throw new Error('Le dossier "x" existe déjà : le Kanban est déjà installé.');
  }
  await write_kanban(project_path, project_name);
  console.log(chalk.green('\n🎉 Kanban ajouté avec succès !\n'));
  console.log('Prochaines étapes :');
  console.log('1. Lance : germin kanban');
  console.log(`2. Tes tâches sont enregistrées dans ${path.join('x', 'task.json')}`);
}

module.exports = { add };
