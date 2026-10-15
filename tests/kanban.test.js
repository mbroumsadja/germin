process.env.NODE_ENV = 'test';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { generate_project } = require('../src/generate');
const { start_kanban } = require('../src/kanban-server');
const { normalize_tasks } = require('../src/tasks');

let tmp, server, base;
beforeAll(async () => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'germin-kb-'));
  await generate_project({ project_path: tmp, project_name: 'kb<script>', kanban: true });
  const started = await start_kanban(tmp, 0);
  server = started.server;
  base = `http://127.0.0.1:${started.port}`;
});
afterAll(() => {
  server.close();
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('GET / sert le Kanban avec le nom échappé', async () => {
  const html = await (await fetch(base + '/')).text();
  expect(html).toMatch(/kb&lt;script&gt;/);
  expect(html).not.toMatch(/__PROJECT_NAME__/);
});

test('PUT /api/tasks écrit réellement x/task.json', async () => {
  const body = [{ title: 'Nouvelle', description: 'd', label: 'done', time: 12, test: 'addition' }, { id: 1, title: 'B', label: 'zzz' }];
  const res = await fetch(base + '/api/tasks', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  expect(res.status).toBe(200);
  const saved = JSON.parse(fs.readFileSync(path.join(tmp, 'x', 'task.json'), 'utf8'));
  expect(saved).toHaveLength(2);
  expect(saved.find((t) => t.title === 'Nouvelle')).toMatchObject({ label: 'done', time: 12, test: 'addition' });
  expect(saved.find((t) => t.title === 'B').label).toBe('todo'); // label invalide normalisé
  expect(new Set(saved.map((t) => t.id)).size).toBe(2);
  const got = await (await fetch(base + '/api/tasks')).json();
  expect(got).toEqual(saved);
});

test('PUT refuse les données invalides sans toucher au fichier', async () => {
  const before = fs.readFileSync(path.join(tmp, 'x', 'task.json'), 'utf8');
  for (const bad of [{ a: 1 }, [{ title: '' }], [{ title: 'x'.repeat(300) }]]) {
    const res = await fetch(base + '/api/tasks', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(bad) });
    expect(res.status).toBe(400);
  }
  expect(fs.readFileSync(path.join(tmp, 'x', 'task.json'), 'utf8')).toBe(before);
});

test('normalize_tasks : ids uniques et conservés', () => {
  const out = normalize_tasks([{ id: 5, title: 'a' }, { id: 5, title: 'b' }, { title: 'c' }]);
  expect(out.map((t) => t.id)).toEqual([5, 6, 7]);
});
