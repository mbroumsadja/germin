const { execSync } = require('child_process');
const chalk = require('chalk');

function has_command(cmd) {
  try {
    execSync(`${cmd} --version`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Vérifie les prérequis.
 * Node.js et npm sont obligatoires ; git est seulement recommandé
 * (nécessaire pour le déploiement), et l'éditeur n'est jamais exigé.
 * @throws {Error} Si Node.js ou npm est manquant.
 */
function check_requisites() {
  if (process.env.NODE_ENV === 'test') {
    return;
  }
  if (!has_command('node')) {
    throw new Error(
      "Node.js n'est pas installé. Installez-le depuis https://nodejs.org."
    );
  }
  if (!has_command('npm')) {
    throw new Error(
      "npm n'est pas installé. Installez-le depuis https://nodejs.org."
    );
  }
  if (!has_command('git')) {
    console.log(
      chalk.yellow(
        "⚠️  Git n'est pas installé : vous en aurez besoin pour déployer (https://git-scm.com)."
      )
    );
  }
}

module.exports = { check_requisites };
