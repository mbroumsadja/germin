#!/usr/bin/env node
const { program } = require('commander');
const chalk = require('chalk');
const path = require('path');
const pkg = require('../package.json');

const wrap =
  (fn) =>
  async (...args) => {
    try {
      await fn(...args);
    } catch (error) {
      console.error(chalk.red(`\n✖ ${error.message}`));
      process.exit(1);
    }
  };
const project = () => require('../src/project').require_project(process.cwd());
const from_cli = (command, name) =>
  command.getOptionValueSource(name) === 'cli';

program
  .name('germin')
  .version(pkg.version, '-v, --version', 'Afficher la version')
  .helpOption('-h, --help', "Afficher l'aide")
  .description(
    chalk.yellowBright(
      `🌱 Germin — le terrain d'entraînement des jeunes développeurs : projets guidés, tests, Kanban, tuteur IA et mise en ligne.`
    )
  );

// ---------- créer
program
  .command('create [project_name]')
  .alias('complete')
  .description('Crée un projet web (Kanban, git et style au choix)')
  .option('--css <type>', 'style : css ou bootstrap')
  .option('--no-kanban', 'sans tableau Kanban')
  .option('--no-git', 'sans git init')
  .option(
    '-y, --yes',
    'accepter les valeurs par défaut sans poser de questions'
  )
  .action(
    wrap(async (project_name, opts, command) => {
      const { create_project } = require('../src/create');
      await create_project({
        project_name,
        css: opts.css,
        kanban: from_cli(command, 'kanban') ? opts.kanban : undefined,
        git: from_cli(command, 'git') ? opts.git : undefined,
        yes: opts.yes,
      });
    })
  );

program
  .command('add')
  .description('Ajoute le Kanban à un projet existant')
  .action(
    wrap(async () => {
      const { add } = require('../lib/add');
      const project_path = process.cwd();
      await add(path.basename(project_path), project_path);
    })
  );

// ---------- apprendre
program
  .command('exemples')
  .description('Liste les projets guidés disponibles')
  .action(
    wrap(async () => {
      const { list_examples } = require('../src/examples');
      console.log(chalk.cyan('\n🎓 Projets guidés (germin new <exemple>) :\n'));
      list_examples().forEach((e) => {
        console.log(
          `  ${chalk.bold(e.id.padEnd(20))} niveau ${e.niveau}  ${e.titre}`
        );
        console.log(chalk.gray(`  ${' '.repeat(20)} ${e.description}`));
      });
      console.log('');
    })
  );

program
  .command('new <exemple> [dossier]')
  .description('Crée un projet guidé (consignes, tests et tâches Kanban liées)')
  .option('--no-git', 'sans git init')
  .action(
    wrap(async (exemple, dossier, opts) => {
      const {
        create_example_project,
        load_example,
      } = require('../src/examples');
      const { name_error } = require('../src/questinnaire');
      const ex = load_example(exemple);
      const name = dossier || ex.id;
      const error = await name_error(name);
      if (error) throw new Error(error);
      await create_example_project({
        id: ex.id,
        project_path: path.join(process.cwd(), name),
        project_name: name,
        git: opts.git,
      });
      console.log(
        chalk.green(`\n🎓 Projet guidé « ${ex.titre} » créé dans ./${name}`)
      );
      console.log(chalk.cyan('\nPour commencer :'));
      console.log(`1. cd ${name}`);
      console.log('2. Lis CONSIGNES.md');
      console.log('3. npm install && npm run dev');
      console.log('4. germin test      → vérifie ton travail');
      console.log('5. germin kanban    → suis ta progression');
      console.log('6. germin hint      → un indice si tu es bloqué(e)');
    })
  );

program
  .command('test')
  .description('Lance les tests du projet guidé et met à jour le Kanban')
  .option('--only <id>', "ne lancer qu'un seul test")
  .action(
    wrap(async (opts) => {
      const { test_command } = require('../src/test-command');
      const result = await test_command({
        project_path: project(),
        only: opts.only,
      });
      if (result.passed < result.total) process.exitCode = 1;
    })
  );

program
  .command('solution')
  .description('Copie la solution dans solution/ (après quelques essais)')
  .action(
    wrap(async () => {
      const { unlock_solution } = require('../src/examples');
      const dir = unlock_solution(project());
      console.log(
        chalk.green(
          `\n🔓 Solution copiée dans ${path.relative(process.cwd(), dir) || dir}`
        )
      );
      console.log("Compare-la avec ton code : qu'as-tu fait différemment ?");
    })
  );

program
  .command('kanban')
  .description('Ouvre le Kanban relié à x/task.json')
  .option('-p, --port <port>', 'port local', '3000')
  .action(
    wrap(async (opts) => {
      const fs = require('fs');
      const root = project();
      if (!fs.existsSync(path.join(root, 'x', 'kanban.html'))) {
        throw new Error(
          "Pas de Kanban dans ce projet : lance d'abord « germin add »."
        );
      }
      const { start_kanban } = require('../src/kanban-server');
      const { port } = await start_kanban(root, Number(opts.port) || 3000);
      console.log(chalk.green(`\n📋 Kanban : http://localhost:${port}`));
      console.log(
        chalk.gray(
          'Tes tâches sont enregistrées dans x/task.json. Ctrl+C pour arrêter.'
        )
      );
    })
  );

// ---------- tuteur IA
program
  .command('hint')
  .description(
    'Un indice progressif sur le premier test en échec (tuteur Claude, ou indice hors ligne)'
  )
  .option('-n, --niveau <1-3>', "forcer le niveau d'aide")
  .option('--only <id>', 'indice pour un test précis')
  .action(
    wrap(async (opts) => {
      await require('../src/ia-commands').hint_command({
        project_path: project(),
        niveau: opts.niveau,
        only: opts.only,
      });
    })
  );

program
  .command('explain [message...]')
  .description(
    "Explique un message d'erreur en français simple (clé ANTHROPIC_API_KEY requise)"
  )
  .option('-f, --fichier <chemin>', 'joindre un fichier de ton projet')
  .action(
    wrap(async (message, opts) => {
      let text = (message || []).join(' ');
      if (!text && !process.stdin.isTTY)
        text = require('fs').readFileSync(0, 'utf8');
      await require('../src/ia-commands').explain_command({
        message: text,
        fichier: opts.fichier,
      });
    })
  );

program
  .command('review [fichier]')
  .description(
    'Relecture bienveillante de ton code, 3 remarques maximum (clé API requise)'
  )
  .action(
    wrap(async (fichier) => {
      await require('../src/ia-commands').review_command({
        project_path: project(),
        fichier,
      });
    })
  );

program
  .command('plan <idee...>')
  .description('Découpe une idée de projet en cartes Kanban (clé API requise)')
  .action(
    wrap(async (idee) => {
      await require('../src/ia-commands').plan_command({
        project_path: project(),
        idee: idee.join(' '),
      });
    })
  );

program
  .command('quiz')
  .description('Un quiz de 5 questions sur ton projet (clé API requise)')
  .action(
    wrap(async () => {
      await require('../src/ia-commands').quiz_command({
        project_path: project(),
      });
    })
  );

// ---------- publier
program
  .command('deploy')
  .description('Met ton site en ligne sur GitHub Pages (guidé)')
  .option(
    '--auto',
    'configure un déploiement automatique à chaque git push (GitHub Actions)'
  )
  .option('-y, --yes', 'répondre oui aux confirmations')
  .action(
    wrap(async (opts) => {
      await require('../src/deploy').deploy({
        project_path: project(),
        auto: opts.auto,
        yes: opts.yes,
      });
    })
  );

program.addHelpText(
  'after',
  `
Exemples :
  germin exemples                 voir les projets guidés
  germin new calculatrice         démarrer un projet guidé
  germin create mon-site          créer un projet libre
  germin deploy                   publier sur github.io

Le tuteur IA est optionnel (variable ANTHROPIC_API_KEY). Ton code n'est envoyé à l'API qu'au moment où tu lances hint, explain, review, plan ou quiz.
`
);

program.parseAsync(process.argv);
