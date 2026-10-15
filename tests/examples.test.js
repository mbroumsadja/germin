process.env.NODE_ENV = 'test';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { list_examples, create_example_project, unlock_solution, load_example } = require('../src/examples');
const { run_tests } = require('../src/runner');
const { test_command } = require('../src/test-command');
const { read_tasks } = require('../src/tasks');
const { read_progress } = require('../src/progress');

let tmp;
beforeEach(() => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'germin-ex-'));
});
afterEach(() => fs.rmSync(tmp, { recursive: true, force: true }));

const ids = list_examples().map((e) => e.id);

test('3 exemples sont fournis, triés par niveau', () => {
  expect(ids.sort()).toEqual(['calculatrice', 'page-presentation', 'quiz']);
  const niveaux = list_examples().map((e) => e.niveau);
  expect([...niveaux].sort()).toEqual(niveaux);
});

test('exemple inconnu : message utile', () => {
  expect(() => load_example('nimportequoi')).toThrow(/Exemples disponibles : .*calculatrice/);
  expect(() => load_example('../etc')).toThrow(/Exemple inconnu/);
});

describe.each(ids)('exemple %s', (id) => {
  async function make() {
    const project_path = path.join(tmp, id);
    await create_example_project({ id, project_path, project_name: id });
    return project_path;
  }

  test('le projet généré contient consignes, tests, tâches liées — mais pas la solution', async () => {
    const p = await make();
    expect(fs.existsSync(path.join(p, 'CONSIGNES.md'))).toBe(true);
    expect(fs.existsSync(path.join(p, 'tests'))).toBe(true);
    expect(fs.existsSync(path.join(p, 'solution'))).toBe(false);
    const tests = await run_tests(p);
    const tasks = read_tasks(p);
    expect(tasks.length).toBeGreaterThan(0);
    // chaque tâche est reliée à un test existant, et inversement
    expect(tasks.map((t) => t.test).sort()).toEqual(tests.map((r) => r.id).sort());
    tests.forEach((r) => expect(r.indices).toHaveLength(3));
  });

  test('le code de départ échoue, la solution réussit, le Kanban suit', async () => {
    const p = await make();
    const out = [];
    let r = await test_command({ project_path: p, out: (l) => out.push(l) });
    expect(r.passed).toBe(0);
    expect(read_tasks(p).every((t) => t.label === 'todo')).toBe(true);

    // solution verrouillée tant qu'on n'a pas essayé
    expect(() => unlock_solution(p)).toThrow(/verrouillée/);
    await test_command({ project_path: p, out: () => {} });
    await test_command({ project_path: p, out: () => {} });
    expect(read_progress(p).runs).toBe(3);
    const sol = unlock_solution(p);
    expect(fs.existsSync(sol)).toBe(true);

    // on applique la solution au projet
    fs.cpSync(sol, p, { recursive: true, force: true });
    r = await test_command({ project_path: p, out: (l) => out.push(l) });
    expect(r.passed).toBe(r.total);
    expect(r.changed).toBe(r.total);
    expect(read_tasks(p).every((t) => t.label === 'done')).toBe(true);
    expect(out.join('\n')).toMatch(/germin deploy/);
  });
});

describe('retours pédagogiques', () => {
  async function calc(code) {
    const p = path.join(tmp, 'calc');
    await create_example_project({ id: 'calculatrice', project_path: p, project_name: 'calc' });
    fs.writeFileSync(path.join(p, 'public/js/script.js'), code);
    return Object.fromEntries((await run_tests(p)).map((r) => [r.id, r]));
  }

  test('oubli du return', async () => {
    const r = await calc('function addition(a, b) { a + b; }');
    expect(r.addition.message).toMatch(/ne renvoie rien.*return/);
  });
  test('texte au lieu de nombre', async () => {
    const r = await calc('function addition(a, b) { return String(a) + String(b); }');
    expect(r.addition.message).toMatch(/addition\(2, 3\) devrait donner 5 mais donne "23".*du texte alors qu'on attend un nombre/);
  });
  test('fonction manquante', async () => {
    const r = await calc('// vide');
    expect(r.addition.message).toMatch(/La fonction `addition` n'existe pas encore/);
  });
  test('erreur de syntaxe', async () => {
    const r = await calc('function addition(a, b) { return a + b; ');
    expect(r.addition.message).toMatch(/Erreur de syntaxe/);
  });
  test('boucle infinie détectée sans bloquer', async () => {
    const r = await calc('function addition(a, b) { while (true) {} }');
    expect(r.addition.message).toMatch(/jamais|infinie/);
  });
  test('code qui plante au chargement', async () => {
    const r = await calc('chose_inconnue.appel();');
    expect(r.addition.message).toMatch(/plante dès le chargement.*ReferenceError/);
  });
  test('division par zéro oubliée : message précis', async () => {
    const r = await calc('function division(a, b) { return a / b; }');
    expect(r.division.ok).toBe(false);
    expect(r.division.message).toMatch(/division\(5, 0\) devrait donner null mais donne Infinity/);
  });
});
