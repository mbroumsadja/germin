const fs = require('fs');
const path = require('path');
const { generate_project } = require('./generate');
const { write_tasks } = require('./tasks');
const { read_config, write_config } = require('./project');
const { read_progress } = require('./progress');

const EXAMPLES_DIR = path.join(__dirname, '..', 'examples');
const UNLOCK_AFTER_RUNS = 3;

function load_example(id) {
  const dir = path.join(EXAMPLES_DIR, id);
  if (
    !/^[a-z0-9-]+$/.test(id) ||
    !fs.existsSync(path.join(dir, 'exemple.json'))
  ) {
    const ids = list_examples()
      .map((e) => e.id)
      .join(', ');
    throw new Error(
      `Exemple inconnu « ${id} ». Exemples disponibles : ${ids}.`
    );
  }
  return {
    dir,
    ...JSON.parse(fs.readFileSync(path.join(dir, 'exemple.json'), 'utf8')),
  };
}

function list_examples() {
  if (!fs.existsSync(EXAMPLES_DIR)) return [];
  return fs
    .readdirSync(EXAMPLES_DIR, { withFileTypes: true })
    .filter(
      (d) =>
        d.isDirectory() &&
        fs.existsSync(path.join(EXAMPLES_DIR, d.name, 'exemple.json'))
    )
    .map((d) =>
      JSON.parse(
        fs.readFileSync(path.join(EXAMPLES_DIR, d.name, 'exemple.json'), 'utf8')
      )
    )
    .sort((a, b) => a.niveau - b.niveau || a.id.localeCompare(b.id));
}

const copy_dir = (from, to) =>
  fs.cpSync(from, to, { recursive: true, force: true });

/** Crée un projet guidé : base Germin + starter + tests + consignes + tâches Kanban liées aux tests. */
async function create_example_project({
  id,
  project_path,
  project_name,
  git = false,
}) {
  const ex = load_example(id);
  await generate_project({
    project_path,
    project_name,
    css: 'css',
    kanban: true,
    git,
  });
  copy_dir(path.join(ex.dir, 'starter'), project_path);
  copy_dir(path.join(ex.dir, 'tests'), path.join(project_path, 'tests'));
  fs.copyFileSync(
    path.join(ex.dir, 'consignes.md'),
    path.join(project_path, 'CONSIGNES.md')
  );
  write_tasks(
    project_path,
    ex.taches.map((t, i) => ({
      id: i + 1,
      title: t.titre,
      description: t.description || '',
      label: 'todo',
      time: 0,
      test: t.test,
    }))
  );
  write_config(project_path, {
    ...read_config(project_path),
    exemple: ex.id,
    type: ex.type,
  });
  return ex;
}

function solution_status(project_path) {
  const runs = read_progress(project_path).runs;
  return {
    runs,
    needed: UNLOCK_AFTER_RUNS,
    unlocked: runs >= UNLOCK_AFTER_RUNS,
  };
}

/** Copie la solution dans solution/ — seulement après quelques essais de `germin test`. */
function unlock_solution(project_path) {
  const config = read_config(project_path);
  if (!config.exemple)
    throw new Error(
      "Ce projet n'est pas un projet guidé : il n'a pas de solution."
    );
  const status = solution_status(project_path);
  if (!status.unlocked) {
    throw new Error(
      `Solution verrouillée : essaie d'abord par toi-même ! Lance « germin test » encore ${status.needed - status.runs} fois (essais : ${status.runs}/${status.needed}), ou demande un indice avec « germin hint ».`
    );
  }
  const ex = load_example(config.exemple);
  const target = path.join(project_path, 'solution');
  copy_dir(path.join(ex.dir, 'solution'), target);
  return target;
}

module.exports = {
  list_examples,
  load_example,
  create_example_project,
  solution_status,
  unlock_solution,
  UNLOCK_AFTER_RUNS,
};
