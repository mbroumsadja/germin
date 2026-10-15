const fs = require('fs/promises');
const path = require('path');
const chalk = require('chalk');

/**
 * Nom de package npm valide : minuscules, chiffres, tirets, underscores.
 */
function to_package_name(project_name) {
  return String(project_name).toLowerCase();
}

async function create_package_json(project_path, project_name) {
  const package_json = {
    name: to_package_name(project_name),
    version: '0.0.1',
    private: true,
    type: 'commonjs',
    scripts: {
      dev: 'vite --host',
      build: 'vite build',
      preview: 'vite preview',
      deploy: 'npm run build && gh-pages -d dist',
    },
    devDependencies: {
      vite: '^6.3.5',
      'gh-pages': '^6.3.0',
    },
  };
  try {
    await fs.writeFile(
      path.join(project_path, 'package.json'),
      JSON.stringify(package_json, null, 2)
    );
  } catch (error) {
    console.error(
      chalk.red('erreur lors de la création de package.json'),
      error
    );
    throw error;
  }
}

module.exports = { create_package_json, to_package_name };
