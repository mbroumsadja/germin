const ora = require('ora');
const fs = require('fs').promises;
const path = require('path');
const { PATHS } = require('./path');
const TEMPLATES = require('./templates');

async function create_file(project_path, project_name, answers) {
  const { css_framework, js_type, include_assets } = answers;
  const spinner = ora('\n création des fichiers...').start();
  try {
    const filePromises = [
      fs.writeFile(
        path.join(project_path, PATHS.index),
        TEMPLATES.html(project_name, js_type, css_framework).trim()
      ),
      fs.writeFile(
        path.join(project_path, PATHS.readme),
        TEMPLATES.readme(project_name, js_type, css_framework).trim()
      ),
      fs.writeFile(
        path.join(project_path, PATHS.trello, 'app.html'),
        TEMPLATES.trello_page(project_name).trim()
      ),
      fs.writeFile(
        path.join(project_path, PATHS.scripts, 'build.js'),
        TEMPLATES.scripts(project_name).trim()
      ),
    ];
    if (include_assets) {
      await fs.mkdir(path.join(project_path, 'public/assets/images'), {
        recursive: true,
      });
      const faviconData = Buffer.from(TEMPLATES.favicon(), 'base64');
      await fs.writeFile(
        path.join(project_path, 'public/assets/images/favicon.png'),
        faviconData
      );
    }
    if (js_type) {
      filePromises.push(
        fs.writeFile(
          path.join(project_path, PATHS.script),
          js_type === 'TypeScript'
            ? TEMPLATES.ts(project_name).trim()
            : TEMPLATES.js(project_name).trim()
        )
      );
    }
    if (css_framework) {
      filePromises.push(
        fs.writeFile(
          path.join(project_path, PATHS.style),
          css_framework === 'Bootstrap'
            ? TEMPLATES.css_bootstrap(project_name).trim()
            : TEMPLATES.css_pur(project_name).trim()
        )
      );
    }
    await Promise.all(filePromises);
    spinner.succeed('fichiers créés.');
  } catch (error) {
    spinner.fail(`èchec de la création des fichiers: ${error.message}`);
    throw error;
  }
}

module.exports = { create_file };
