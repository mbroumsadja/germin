const fs = require('fs').promises;
const path = require('path');
const ora = require('ora');
const { PATHS } = require('./path');

async function create_directories(project_path, js_type, answers) {
  const spinner = ora('\nCréation des répertoires...').start();
  const { project_type, optionel } = answers;

  try {
    await create_main_directories(project_path);
    if (project_type === 'statique HTML/CSS') {
      await create_static_html_css_directories(project_path, optionel);
    } else if (project_type === 'statique HTML/CSS/JS') {
      await create_static_html_css_js_directories(
        project_path,
        js_type,
        optionel
      );
    }
    if (optionel.includes('pages (public/pages)')) {
      await fs.mkdir(path.join(project_path, PATHS.pages), { recursive: true });
    }
    if (optionel.includes('images (public/assets/images)')) {
      await fs.mkdir(path.join(project_path, PATHS.assets, 'images'), {
        recursive: true,
      });
      await fs.copyFile(
        path.join(process.cwd(), '/favicon_io/android-chrome-512x512.png'),
        path.join(project_path, PATHS.image_1)
      );
      await fs.copyFile(
        path.join(process.cwd(), '/favicon_io/android-chrome-192x192.png'),
        path.join(project_path, PATHS.image_2)
      );
    }
    spinner.succeed('Répertoires créés avec succès.');
  } catch (error) {
    spinner.fail('Échec de la création des répertoires.');
    throw error;
  }
}

async function create_main_directories(project_path) {
  await fs.mkdir(project_path, { recursive: true });
  await fs.mkdir(path.join(project_path, PATHS.x));
  (async () => {
    await fs.mkdir(path.join(project_path, 'x/scripts'), { recursive: true });
  })();
}

async function create_static_html_css_directories(project_path, optionel) {
  await fs.mkdir(path.join(project_path, PATHS.public));
  await fs.mkdir(path.join(project_path, PATHS.css));
  await create_optional_directories(project_path, optionel);
}

async function create_static_html_css_js_directories(
  project_path,
  js_type,
  optionel
) {
  await fs.mkdir(path.join(project_path, PATHS.public));
  await fs.mkdir(path.join(project_path, PATHS.css));
  if (
    ['javascript', 'javascript/ASYNC', 'javascript/FETCH'].includes(js_type)
  ) {
    await fs.mkdir(path.join(project_path, PATHS.js));
  }
  await create_optional_directories(project_path, optionel);
}

async function create_optional_directories(project_path, optionel) {
  if (optionel.includes('pages (public/pages)')) {
    await fs.mkdir(path.join(project_path, PATHS.pages), { recursive: true });
  }
  if (optionel.includes('images (public/assets/images)')) {
    await fs.mkdir(path.join(project_path, PATHS.assets, 'images'), {
      recursive: true,
    });
  }
}

module.exports = { create_directories };
