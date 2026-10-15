process.env.NODE_ENV = 'test';
const fs = require('fs');
const os = require('os');
const path = require('path');
const validate = require('validate-npm-package-name');
const { create_project } = require('../src/create');
const simple = require('../lib/simple');
const { add } = require('../lib/add');
const { prompt_user } = require('../src/questinnaire');
const vm = require('vm');

let tmp;
let cwd;
beforeEach(() => {
  cwd = process.cwd();
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'germin-'));
  process.chdir(tmp);
  delete process.env.GERMIN_PROJECT_NAME;
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => {
  process.chdir(cwd);
  fs.rmSync(tmp, { recursive: true, force: true });
  jest.restoreAllMocks();
});

const read = (...p) => fs.readFileSync(path.join(tmp, ...p), 'utf8');
const exists = (...p) => fs.existsSync(path.join(tmp, ...p));
function local_links(dir) {
  const html = read(dir, 'index.html');
  return [...html.matchAll(/(?:href|src)="(\.?\/?public\/[^"]+)"/g)].map((m) => m[1].replace(/^\.\//, ''));
}

describe('germin create', () => {
  test('génère package.json valide, vite, gitignore, germin.json et Kanban', async () => {
    const r = await create_project({ project_name: 'Mon-Projet', yes: true, git: false });
    expect(r.kanban).toBe(true);
    const pkg = JSON.parse(read('Mon-Projet', 'package.json'));
    expect(pkg.name).toBe('mon-projet');
    expect(validate(pkg.name).validForNewPackages).toBe(true);
    expect(read('Mon-Projet', '.gitignore')).toMatch(/dist\//);
    expect(read('Mon-Projet', '.gitignore')).toMatch(/\.env/);
    const cfg = JSON.parse(read('Mon-Projet', 'germin.json'));
    expect(cfg).toMatchObject({ nom: 'Mon-Projet', css: 'css', kanban: true, exemple: null });
    expect(exists('Mon-Projet', 'x', 'kanban.html')).toBe(true);
    expect(JSON.parse(read('Mon-Projet', 'x', 'task.json'))[0].id).toBe(1);
  });

  test('--no-kanban : pas de dossier x/', async () => {
    await create_project({ project_name: 'sans-kanban', yes: true, kanban: false, git: false });
    expect(exists('sans-kanban', 'x')).toBe(false);
  });

  test('Bootstrap : le lien CDN est ajouté', async () => {
    await create_project({ project_name: 'bs', yes: true, css: 'bootstrap', git: false });
    expect(read('bs', 'index.html')).toMatch(/bootstrap@5\.3\.3/);
    expect(JSON.parse(read('bs', 'germin.json')).css).toBe('bootstrap');
  });

  test('git init quand demandé', async () => {
    const r = await create_project({ project_name: 'avec-git', yes: true, git: true });
    expect(r.git).toBe(true);
    expect(exists('avec-git', '.git')).toBe(true);
  });

  test('les liens de index.html pointent vers des fichiers existants', async () => {
    await create_project({ project_name: 'demo', yes: true, git: false });
    const links = local_links('demo');
    expect(links.length).toBeGreaterThan(0);
    links.forEach((l) => expect(exists('demo', l)).toBe(true));
  });

  test('refuse un nom invalide ou un dossier existant', async () => {
    await expect(create_project({ project_name: '-mauvais', yes: true })).rejects.toThrow(/commencer par/);
    fs.mkdirSync('deja');
    await expect(create_project({ project_name: 'deja', yes: true })).rejects.toThrow(/existe déjà/);
  });

  test('css invalide refusé', async () => {
    await expect(prompt_user({ project_name: 'x1', css: 'sass', yes: true })).rejects.toThrow(/--css/);
  });
});

describe('germin create (simple, compat)', () => {
  test('nom de package valide, pas de globale, liens corrects', async () => {
    delete global.project_path;
    await simple(path.join(tmp, 'demo-simple'), 'demo-simple');
    const pkg = JSON.parse(read('demo-simple', 'package.json'));
    expect(validate(pkg.name).validForNewPackages).toBe(true);
    expect(exists('demo-simple', 'x')).toBe(false);
    local_links('demo-simple').forEach((l) => expect(exists('demo-simple', l)).toBe(true));
  });
});

describe('déploiement GitHub Pages (préparation)', () => {
  test('script classique, base "./" et deploy construit avant de publier', async () => {
    await simple(path.join(tmp, 'gh'), 'gh');
    // script classique servi depuis public/ : fonctions globales (onclick OK), non supprimé par le bundler
    expect(read('gh', 'index.html')).toMatch(/<script src="\.\/js\/script\.js" defer><\/script>/);
    expect(exists('gh', 'public', 'js', 'script.js')).toBe(true);
    expect(read('gh', 'vite.config.js')).toMatch(/base:\s*'\.\/'/);
    expect(read('gh', 'vite.config.js')).toMatch(/customLogger: logger/); // pas d'avertissement anxiogène
    const pkg = JSON.parse(read('gh', 'package.json'));
    expect(pkg.scripts.deploy).toMatch(/npm run build && gh-pages -d dist/);
    expect(pkg.devDependencies['gh-pages']).toBeDefined();
  });
});

describe('fichiers générés valides', () => {
  test('vite.config.js, script.js et package.json sont syntaxiquement valides', async () => {
    await create_project({ project_name: 'syntaxe', yes: true, git: false });
    ['vite.config.js', 'public/js/script.js'].forEach((f) => {
      expect(() => new vm.Script(read('syntaxe', f), { filename: f })).not.toThrow();
    });
    expect(() => JSON.parse(read('syntaxe', 'package.json'))).not.toThrow();
    expect(() => JSON.parse(read('syntaxe', 'x', 'task.json'))).not.toThrow();
  });
});

describe('germin add', () => {
  test('crée x/kanban.html et x/task.json, refuse si déjà présent', async () => {
    await add('mon-app', tmp);
    expect(exists('x', 'kanban.html')).toBe(true);
    expect(read('x', 'kanban.html')).toMatch(/mon-app/);
    expect(JSON.parse(read('x', 'task.json')).length).toBeGreaterThan(0);
    await expect(add('mon-app', tmp)).rejects.toThrow(/existe déjà/);
  });
});
