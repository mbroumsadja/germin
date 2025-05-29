const { execSync } = require('child_process');

/**
 * Vérifie les prérequis (Node.js, Git).
 * @throws {Error} Si un prérequis est manquant.
 */

function check_requisites() {
  // Skip checks in test environment
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  try {
    execSync('node --version', { stdio: 'ignore' });
  } catch {
    throw new Error(
      'Node.js n`est pas installé. Installez-le depuis https://nodejs.org.'
    );
  }

  try {
    execSync('npm --version', { stdio: 'ignore' });
  } catch {
    throw new Error(
      'npm n`est pas installé. Installez-le depuis https://nodejs.org.'
    );
  }

  try {
    execSync('git --version', { stdio: 'ignore' });
  } catch {
    throw new Error(
      'Git n`est pas installé. Installez-le depuis https://git-scm.com.'
    );
  }
}

module.exports = { check_requisites };
