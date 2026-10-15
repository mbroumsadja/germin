const fs = require('fs');
const path = require('path');
const { read_tasks, write_tasks } = require('./tasks');

const file_of = (p) => path.join(p, '.germin', 'progress.json');

function read_progress(project_path) {
  try {
    return {
      runs: 0,
      tests: {},
      hints: {},
      quizzes: [],
      ...JSON.parse(fs.readFileSync(file_of(project_path), 'utf8')),
    };
  } catch {
    return { runs: 0, tests: {}, hints: {}, quizzes: [] };
  }
}

function write_progress(project_path, progress) {
  fs.mkdirSync(path.dirname(file_of(project_path)), { recursive: true });
  fs.writeFileSync(
    file_of(project_path),
    JSON.stringify(progress, null, 2) + '\n'
  );
}

function record_run(project_path, results) {
  const progress = read_progress(project_path);
  progress.runs += 1;
  results.forEach((r) => {
    const before = progress.tests[r.id] || { tries: 0 };
    progress.tests[r.id] = { passed: r.ok, tries: before.tries + 1 };
  });
  write_progress(project_path, progress);
  return progress;
}

/** Incrémente le compteur d'indices d'un test et renvoie le nouveau total. */
function record_hint(project_path, test_id) {
  const progress = read_progress(project_path);
  progress.hints[test_id] = (progress.hints[test_id] || 0) + 1;
  write_progress(project_path, progress);
  return progress.hints[test_id];
}

function record_quiz(project_path, score, total) {
  const progress = read_progress(project_path);
  progress.quizzes.push({ date: new Date().toISOString(), score, total });
  write_progress(project_path, progress);
}

/**
 * Relie le Kanban aux tests : une tâche liée à un test réussi passe en « done » ;
 * si ce test échoue de nouveau, elle repasse « in-progress ».
 * @returns {number} nombre de tâches modifiées
 */
function sync_tasks(project_path, results) {
  if (!fs.existsSync(path.join(project_path, 'x', 'task.json'))) return 0;
  const tasks = read_tasks(project_path);
  let changed = 0;
  tasks.forEach((task) => {
    const r = task.test && results.find((x) => x.id === task.test);
    if (!r) return;
    if (r.ok && task.label !== 'done') {
      task.label = 'done';
      changed++;
    } else if (!r.ok && task.label === 'done') {
      task.label = 'in-progress';
      changed++;
    }
  });
  if (changed) write_tasks(project_path, tasks);
  return changed;
}

module.exports = {
  read_progress,
  write_progress,
  record_run,
  record_hint,
  record_quiz,
  sync_tasks,
};
