const fs = require('fs');
const path = require('path');

/** Remonte les dossiers jusqu'à trouver germin.json (racine du projet). */
function find_project(start = process.cwd()) {
  let dir = path.resolve(start);
  for (let i = 0; i < 6; i++) {
    if (fs.existsSync(path.join(dir, 'germin.json'))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

function require_project(start) {
  const root = find_project(start);
  if (!root) {
    throw new Error(
      'Aucun projet Germin ici (germin.json introuvable). Place-toi dans le dossier de ton projet.'
    );
  }
  return root;
}

function read_config(project_path) {
  return JSON.parse(
    fs.readFileSync(path.join(project_path, 'germin.json'), 'utf8')
  );
}

function write_config(project_path, config) {
  fs.writeFileSync(
    path.join(project_path, 'germin.json'),
    JSON.stringify(config, null, 2) + '\n'
  );
}

module.exports = { find_project, require_project, read_config, write_config };
