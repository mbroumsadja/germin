const fs = require('fs');
const path = require('path');

const LABELS = ['todo', 'in-progress', 'done'];

/**
 * Valide et normalise une liste de tâches (ids uniques, champs par défaut).
 * @throws {Error} si la liste ou un titre est invalide.
 */
function normalize_tasks(list) {
  if (!Array.isArray(list)) {
    throw new Error('Le fichier de tâches doit contenir un tableau.');
  }
  const used = new Set();
  list.forEach((t) => {
    if (t && Number.isInteger(t.id) && t.id > 0) used.add(t.id);
  });
  let next = Math.max(0, ...used) + 1;
  const seen = new Set();
  return list.map((t) => {
    if (!t || typeof t.title !== 'string' || !t.title.trim()) {
      throw new Error('Chaque tâche doit avoir un titre.');
    }
    if (t.title.length > 200) {
      throw new Error('Un titre de tâche ne peut pas dépasser 200 caractères.');
    }
    let id = t.id;
    if (!Number.isInteger(id) || id <= 0 || seen.has(id)) id = next++;
    seen.add(id);
    const task = {
      id,
      title: t.title.trim(),
      description:
        typeof t.description === 'string' ? t.description.slice(0, 2000) : '',
      label: LABELS.includes(t.label) ? t.label : 'todo',
      time: Number.isFinite(t.time) && t.time >= 0 ? Math.floor(t.time) : 0,
    };
    if (typeof t.test === 'string' && t.test) task.test = t.test.slice(0, 80);
    return task;
  });
}

function task_file(project_path) {
  return path.join(project_path, 'x', 'task.json');
}

function read_tasks(project_path) {
  const file = task_file(project_path);
  if (!fs.existsSync(file)) return [];
  return normalize_tasks(JSON.parse(fs.readFileSync(file, 'utf8')));
}

function write_tasks(project_path, tasks) {
  const file = task_file(project_path);
  const clean = normalize_tasks(tasks);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(clean, null, 2) + '\n');
  fs.renameSync(tmp, file);
  return clean;
}

module.exports = {
  LABELS,
  normalize_tasks,
  read_tasks,
  write_tasks,
  task_file,
};
