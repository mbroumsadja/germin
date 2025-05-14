#!/usr/bin/env node

const { createProject } = require('../src/createProject');
const chalk = require('chalk');

async function main() {
  console.log(chalk.blue('Germin - Générateur de projet web static v1.0.0'));
  try {
    await createProject();
  } catch (error) {
    console.error(chalk.red(`Erreur : ${error.message}`));
    process.exit(1);
  }
}

main();
