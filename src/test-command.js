const chalk = require('chalk');
const { run_tests } = require('./runner');
const { record_run, sync_tasks } = require('./progress');

/** Lance les tests, enregistre la progression et met à jour le Kanban. */
async function test_command({ project_path, only, out = console.log }) {
  const results = await run_tests(project_path, { only });
  if (!results) {
    throw new Error(
      'Pas de dossier tests/ dans ce projet. Crée un projet guidé avec « germin new <exemple> » (liste : germin exemples).'
    );
  }
  const progress = record_run(project_path, results);
  const changed = sync_tasks(project_path, results);
  const passed = results.filter((r) => r.ok).length;

  out('');
  results.forEach((r) => {
    out(r.ok ? chalk.green(`  ✓ ${r.titre}`) : chalk.red(`  ✗ ${r.titre}`));
    if (!r.ok) out(chalk.yellow(`      → ${r.message}`));
  });
  out('');
  const filled = results.length
    ? Math.round((passed / results.length) * 20)
    : 0;
  out(
    `  [${'█'.repeat(filled)}${'░'.repeat(20 - filled)}] ${passed}/${results.length} réussis`
  );
  if (changed)
    out(
      chalk.cyan(
        `  📋 Kanban mis à jour (${changed} tâche${changed > 1 ? 's' : ''}).`
      )
    );
  if (passed === results.length && results.length > 0) {
    out(
      chalk.green(
        '\n  🎉 Bravo, tout est validé ! Mets ton travail en ligne : germin deploy'
      )
    );
  } else if (results.length) {
    out(chalk.cyan("\n  Besoin d'aide ? germin hint (indice progressif)"));
  }
  return {
    results,
    passed,
    total: results.length,
    changed,
    runs: progress.runs,
  };
}

module.exports = { test_command };
