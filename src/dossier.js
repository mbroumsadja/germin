const fs = require('fs').promises;
const path = require('path');
const ora = require('ora');
const { PATHS } = require('./path');

async function create_directories(
  project_path,
  js_type,
  include_assets,
  include_pages
) {
  const spinner = ora('\n création des répertoires...').start();
  try {
    await fs.mkdir(project_path);
    await fs.mkdir(path.join(project_path, PATHS.public));
    await fs.mkdir(path.join(project_path, PATHS.css));
    await fs.mkdir(path.join(project_path, PATHS.trello));
    await fs.mkdir(path.join(project_path, PATHS.scripts));
    if (include_assets)
      await fs.mkdir(path.join(project_path, PATHS.assets), {
        recursive: true,
      });
    if (include_pages) await fs.mkdir(path.join(project_path, PATHS.pages));
    if (js_type) await fs.mkdir(path.join(project_path, PATHS.js));
    spinner.succeed('répertoires créés.');
  } catch (error) {
    spinner.fail('èchec de la création des répertoires.');
    throw error;
  }
}

module.exports = { create_directories };
