const fs = require('fs/promises');
const path = require('path');
const { execSync } = require('child_process');
const { PATHS } = require('./path');
const TEMPLATES = require('./templates');
const { create_package_json } = require('./package');
const pkg = require('../package.json');

const KANBAN_TEMPLATE = path.join(__dirname, '..', 'templates', 'kanban.html');

async function write(project_path, rel, content) {
  const full = path.join(project_path, rel);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, content.trim() + '\n');
}

function escape_html(text) {
  return String(text).replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ]
  );
}

/** Écrit x/kanban.html et x/task.json (tâches d'exemple si fournies). */
async function write_kanban(project_path, project_name, tasks_json) {
  const html = (await fs.readFile(KANBAN_TEMPLATE, 'utf8')).replace(
    /__PROJECT_NAME__/g,
    escape_html(project_name)
  );
  await write(project_path, path.join(PATHS.x, 'kanban.html'), html);
  await write(
    project_path,
    path.join(PATHS.x, 'task.json'),
    tasks_json || TEMPLATES.TASK()
  );
}

/**
 * Génère un projet Germin complet. Point d'entrée unique pour create/new/simple.
 * @param {{project_path:string, project_name:string, css?:'css'|'bootstrap', kanban?:boolean, git?:boolean}} opts
 */
async function generate_project({
  project_path,
  project_name,
  css = 'css',
  kanban = true,
  git = false,
}) {
  const options = { css, kanban, git };
  await fs.mkdir(path.join(project_path, PATHS.assets, 'images'), {
    recursive: true,
  });
  await fs.mkdir(path.join(project_path, PATHS.pages), { recursive: true });

  await write(project_path, PATHS.index, TEMPLATES.HTML(project_name, options));
  await write(project_path, PATHS.readme, TEMPLATES.README(project_name));
  await write(project_path, PATHS.style, TEMPLATES.CSS(project_name));
  await write(project_path, PATHS.script, TEMPLATES.JS(project_name));
  await write(project_path, PATHS.gitignore, TEMPLATES.GITIGNORE());
  await write(project_path, PATHS.vite, TEMPLATES.VITE());
  await write(
    project_path,
    'germin.json',
    JSON.stringify(
      { germin: pkg.version, nom: project_name, css, kanban, exemple: null },
      null,
      2
    )
  );
  await create_package_json(project_path, project_name);
  if (kanban) await write_kanban(project_path, project_name);

  let git_initialized = false;
  if (git) {
    try {
      execSync('git init', { cwd: project_path, stdio: 'ignore' });
      git_initialized = true;
    } catch {
      /* git absent : on continue sans */
    }
  }
  return { ...options, git: git_initialized };
}

module.exports = { generate_project, write_kanban, escape_html };
