const ora = require('ora');
const { promises: fs } = require('fs');
const path = require('path');
const { PATHS } = require('./path');
const TEMPLATES = require('./templates');

async function create_file(project_path, project_name, answers) {
  const { css_framework, js_type, project_type } = answers;
  const spinner = ora('\nCréation des fichiers...').start();

  try {
    const filePromises = [];
    filePromises.push(
      fs.writeFile(
        path.join(project_path, PATHS.readme),
        TEMPLATES.README(project_name).trim()
      )
    );
    filePromises.push(
      fs.writeFile(
        path.join(project_path, PATHS.scripts, 'build.js'),
        TEMPLATES.SCRIPT(project_name).trim()
      )
    );
    filePromises.push(
      fs.writeFile(
        path.join(project_path, PATHS.gitignore),
        TEMPLATES.GITIGNORE(project_name).trim()
      )
    );
    filePromises.push(
      fs.writeFile(path.join(project_path, PATHS.vite), TEMPLATES.VITE().trim())
    );

    filePromises.push(
      fs.writeFile(
        path.join(project_path, PATHS.x, 'app.html'),
        TEMPLATES.APP(project_name).trim()
      )
    );
    filePromises.push(
      fs.writeFile(
        path.join(project_path, PATHS.x, 'task.json'),
        TEMPLATES.TASK().trim()
      )
    );
    if (project_type === 'statique HTML') {
      filePromises.push(
        fs.writeFile(
          path.join(project_path, PATHS.index),
          TEMPLATES.HTML(project_name).trim()
        )
      );
    }
    if (project_type === 'statique HTML/CSS' && css_framework) {
      filePromises.push(
        fs.writeFile(
          path.join(project_path, PATHS.index),
          css_framework === 'framework (Bootstrap)'
            ? TEMPLATES.HTML_BOOTSTRAP(project_name).trim()
            : TEMPLATES.HTML_CSS_JS(project_name).trim()
        )
      );
      filePromises.push(
        fs.writeFile(
          path.join(project_path, PATHS.style),
          css_framework === 'framework (Bootstrap)'
            ? TEMPLATES.BOOTSTRAP(project_name).trim()
            : TEMPLATES.CSS(project_name).trim()
        )
      );
    }

    if (project_type === 'statique HTML/CSS/JS' && css_framework) {
      filePromises.push(
        fs.writeFile(
          path.join(project_path, PATHS.index),
          css_framework === 'framework (Bootstrap)'
            ? TEMPLATES.HTML_BOOTSTRAP(project_name).trim()
            : TEMPLATES.HTML_CSS_JS(project_name).trim()
        )
      );
      if (js_type) {
        filePromises.push(
          fs.writeFile(
            path.join(project_path, PATHS.script),
            TEMPLATES.JS(project_name).trim()
          )
        );
      }

      filePromises.push(
        fs.writeFile(
          path.join(project_path, PATHS.style),
          css_framework === 'framework (Bootstrap)'
            ? TEMPLATES.BOOTSTRAP(project_name).trim()
            : TEMPLATES.CSS(project_name).trim()
        )
      );
    }
    await Promise.all(filePromises);
    spinner.succeed('Fichiers créés avec succès.');
  } catch (error) {
    spinner.fail(`Échec de la création des fichiers: ${error.message}`);
    throw error;
  }
}

module.exports = { create_file };
