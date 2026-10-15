const ora = require('ora');
const { promises: fs } = require('fs');
const path = require('path');
const { PATHS } = require('./path');
const TEMPLATES = require('./templates');

async function create_file(project_path, project_name) {
  const spinner = ora('création des fichiers...').start();
  const files = [
    [PATHS.index, TEMPLATES.HTML(project_name)],
    [PATHS.readme, TEMPLATES.README(project_name)],
    [path.join(PATHS.x, 'kanban.html'), TEMPLATES.KANBAN(project_name)],
    [path.join(PATHS.x, 'task.json'), TEMPLATES.TASK()],
    [PATHS.style, TEMPLATES.CSS(project_name)],
    [PATHS.script, TEMPLATES.JS(project_name)],
    [PATHS.gitignore, TEMPLATES.GITIGNORE()],
    [PATHS.vite, TEMPLATES.VITE()],
  ];
  try {
    await Promise.all(
      files.map(([name, content]) =>
        fs.writeFile(path.join(project_path, name), content.trim())
      )
    );
    spinner.succeed('fichiers créés avec succès.');
    files.forEach(([name]) => console.log(`📂 ${name} créé`));
  } catch (error) {
    spinner.fail('échec de la création des fichiers');
    throw error;
  }
}

module.exports = { create_file };
