const { generate_project } = require('../src/generate');

/**
 * Projet minimal (sans Kanban ni git). Conservé pour compatibilité :
 * utilisez plutôt `germin create`.
 */
async function simple(project_path, project_name) {
  return generate_project({ project_path, project_name, css: 'css', kanban: false, git: false });
}

module.exports = simple;
