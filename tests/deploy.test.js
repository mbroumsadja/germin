process.env.NODE_ENV = 'test';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { deploy, parse_github_remote, pages_url, explain_failure, WORKFLOW } = require('../src/deploy');

let tmp;
beforeEach(() => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'germin-dep-'));
  fs.writeFileSync(path.join(tmp, 'package.json'), JSON.stringify({ name: 'mon-site', scripts: { build: 'vite build' } }));
  fs.writeFileSync(path.join(tmp, 'germin.json'), JSON.stringify({ nom: 'mon-site' }));
});
afterEach(() => fs.rmSync(tmp, { recursive: true, force: true }));

/** Faux shell : simule git/gh/npm selon un état, et enregistre les commandes. */
function fake(state = {}) {
  const s = { git: true, repo: true, commit: true, dirty: false, origin: 'https://github.com/awa/mon-site.git', gh: false, fail: {}, ...state };
  const calls = [];
  const run = (cmd) => {
    calls.push(cmd);
    for (const [pattern, stderr] of Object.entries(s.fail)) {
      if (cmd.includes(pattern)) throw Object.assign(new Error(stderr), { stderr });
    }
    const no = (m = 'fatal') => { throw Object.assign(new Error(m), { stderr: m }); };
    if (cmd === 'git --version') return s.git ? 'git version 2.45' : no();
    if (cmd === 'git rev-parse --is-inside-work-tree') return s.repo ? 'true' : no('fatal: not a git repository');
    if (cmd === 'git init') { s.repo = true; return ''; }
    if (cmd === 'git rev-parse HEAD') return s.commit ? 'abc123' : no();
    if (cmd === 'git status --porcelain') return s.dirty ? ' M index.html' : '';
    if (cmd.startsWith('git commit')) { s.commit = true; s.dirty = false; return ''; }
    if (cmd === 'git remote get-url origin') return s.origin || no();
    if (cmd === 'gh auth status') return s.gh ? 'ok' : no();
    if (cmd.startsWith('gh repo create')) { s.origin = 'https://github.com/awa/mon-site.git'; return ''; }
    if (cmd.startsWith('git remote add origin')) { s.origin = cmd.split(' ').pop(); return ''; }
    return '';
  };
  return { run, calls, s };
}
const lines = () => { const o = []; return { out: (l) => o.push(String(l)), text: () => o.join('\n') }; };
const ask = (answers = {}) => ({ confirm: async () => answers.confirm ?? true, input: async () => answers.input });
const withModules = () => fs.mkdirSync(path.join(tmp, 'node_modules'));

describe('utilitaires', () => {
  test('parse_github_remote', () => {
    expect(parse_github_remote('https://github.com/awa/mon-site.git')).toEqual({ user: 'awa', repo: 'mon-site' });
    expect(parse_github_remote('git@github.com:awa/mon-site.git')).toEqual({ user: 'awa', repo: 'mon-site' });
    expect(parse_github_remote('https://token@github.com/awa/mon-site')).toEqual({ user: 'awa', repo: 'mon-site' });
    expect(parse_github_remote('https://gitlab.com/awa/x.git')).toBeNull();
    expect(parse_github_remote('https://github.com/awa/x; rm -rf /')).toBeNull();
  });
  test('pages_url : dépôt projet vs site utilisateur', () => {
    expect(pages_url({ user: 'awa', repo: 'mon-site' })).toBe('https://awa.github.io/mon-site/');
    expect(pages_url({ user: 'Awa', repo: 'awa.github.io' })).toBe('https://Awa.github.io/');
  });
  test.each([
    ['fatal: Authentication failed for', /refuse ton identité/],
    ['remote: Repository not found.', /introuvable/],
    ['Please tell me who you are.', /git config --global user\.name/],
    ['! [rejected] main -> main (non-fast-forward)', /git pull --rebase/],
    ['Could not resolve host: github.com', /connexion/],
    ['sh: vite: not found', /npm install/],
    ['quelque chose d\'inconnu', /germin explain/],
  ])('explain_failure(%s)', (stderr, re) => expect(explain_failure(stderr)).toMatch(re));
  test('le workflow utilise les versions actuelles et les permissions Pages', () => {
    expect(WORKFLOW).toMatch(/actions\/deploy-pages@v5/);
    expect(WORKFLOW).toMatch(/actions\/upload-pages-artifact@v5/);
    expect(WORKFLOW).toMatch(/actions\/configure-pages@v6/);
    expect(WORKFLOW).toMatch(/pages: write/);
    expect(WORKFLOW).toMatch(/id-token: write/);
    expect(WORKFLOW).toMatch(/path: dist/);
    expect(WORKFLOW).toMatch(/\$\{\{ steps\.deployment\.outputs\.page_url \}\}/);
  });
});

describe('germin deploy (gh-pages)', () => {
  test('chemin heureux : push, build, publication dans le bon ordre, URL finale', async () => {
    withModules();
    const f = fake();
    const o = lines();
    const r = await deploy({ project_path: tmp, run: f.run, ask: ask(), out: o.out });
    expect(r.url).toBe('https://awa.github.io/mon-site/');
    const idx = (c) => f.calls.findIndex((x) => x.startsWith(c));
    expect(idx('git push')).toBeGreaterThan(-1);
    expect(idx('git push')).toBeLessThan(idx('npm run build'));
    expect(idx('npm run build')).toBeLessThan(idx('npx --yes gh-pages -d dist'));
    expect(f.calls).not.toContain('npm install'); // node_modules présent
    expect(o.text()).toMatch(/https:\/\/awa\.github\.io\/mon-site\//);
    expect(o.text()).toMatch(/Settings → Pages/);
    expect(o.text()).toMatch(/404 juste après est normale/);
  });

  test('installe les dépendances si node_modules est absent', async () => {
    const f = fake();
    await deploy({ project_path: tmp, run: f.run, ask: ask(), out: () => {} });
    expect(f.calls).toContain('npm install');
  });

  test('pas de dépôt git, pas de commit : init + commit proposés', async () => {
    withModules();
    const f = fake({ repo: false, commit: false, dirty: true });
    await deploy({ project_path: tmp, run: f.run, ask: ask(), out: () => {}, yes: true });
    expect(f.calls).toEqual(expect.arrayContaining(['git init', 'git add -A', 'git commit -m "Mise à jour avec Germin"']));
  });

  test('refus du commit sans historique : annulation claire', async () => {
    const f = fake({ commit: false, dirty: true });
    await expect(deploy({ project_path: tmp, run: f.run, ask: ask({ confirm: false }), out: () => {} })).rejects.toThrow(/au moins un commit/);
    expect(f.calls.some((c) => c.startsWith('npm run build'))).toBe(false);
  });

  test('aucun origin : l\'élève colle l\'adresse, elle est validée et ajoutée', async () => {
    withModules();
    const f = fake({ origin: '' });
    const r = await deploy({ project_path: tmp, run: f.run, ask: ask({ input: 'https://github.com/awa/mon-site.git' }), out: () => {} });
    expect(f.calls).toContain('git remote add origin https://github.com/awa/mon-site.git');
    expect(r.url).toBe('https://awa.github.io/mon-site/');
  });

  test('aucun origin + GitHub CLI connecté : création du dépôt', async () => {
    withModules();
    const f = fake({ origin: '', gh: true });
    await deploy({ project_path: tmp, run: f.run, ask: ask(), out: () => {} });
    expect(f.calls).toContain('gh repo create mon-site --public --source=. --remote=origin');
  });

  test('aucun origin en mode --yes sans gh : erreur explicite (pas de blocage)', async () => {
    const f = fake({ origin: '' });
    await expect(deploy({ project_path: tmp, run: f.run, ask: ask(), out: () => {}, yes: true })).rejects.toThrow(/github\.com\/new/);
  });

  test('échec d\'authentification : message clair, arrêt avant le build', async () => {
    withModules();
    const f = fake({ fail: { 'git push': 'fatal: Authentication failed for https://github.com/awa/mon-site.git' } });
    const o = lines();
    await expect(deploy({ project_path: tmp, run: f.run, ask: ask(), out: o.out })).rejects.toThrow(/Déploiement interrompu \(git push\)/);
    expect(o.text()).toMatch(/refuse ton identité/);
    expect(f.calls.some((c) => c.startsWith('npm run build'))).toBe(false);
  });

  test('échec du build : le conseil Vite est donné et rien n\'est publié', async () => {
    withModules();
    const f = fake({ fail: { 'npm run build': 'sh: vite: not found' } });
    const o = lines();
    await expect(deploy({ project_path: tmp, run: f.run, ask: ask(), out: o.out })).rejects.toThrow(/npm run build/);
    expect(o.text()).toMatch(/npm install/);
    expect(f.calls.some((c) => c.includes('gh-pages'))).toBe(false);
  });

  test('git absent / dossier non-projet', async () => {
    await expect(deploy({ project_path: tmp, run: fake({ git: false }).run, ask: ask(), out: () => {} })).rejects.toThrow(/git-scm\.com/);
    const vide = fs.mkdtempSync(path.join(os.tmpdir(), 'germin-vide-'));
    await expect(deploy({ project_path: vide, run: fake().run, ask: ask(), out: () => {} })).rejects.toThrow(/projet Germin/);
    fs.rmSync(vide, { recursive: true });
  });
});

describe('germin deploy --auto (GitHub Actions)', () => {
  test('écrit le workflow, le commite et le pousse, sans appeler gh-pages ni build local', async () => {
    const f = fake({ dirty: false });
    const o = lines();
    const r = await deploy({ project_path: tmp, run: f.run, ask: ask(), out: o.out, auto: true });
    const file = path.join(tmp, '.github', 'workflows', 'deploy.yml');
    expect(fs.readFileSync(file, 'utf8')).toBe(WORKFLOW);
    expect(f.calls).toEqual(expect.arrayContaining(['git add -A', 'git push -u origin HEAD']));
    expect(f.calls.some((c) => c.includes('gh-pages') || c.startsWith('npm run build'))).toBe(false);
    expect(o.text()).toMatch(/Source : « GitHub Actions »/);
    expect(o.text()).toMatch(/github\.com\/awa\/mon-site\/actions/);
    expect(r).toEqual({ auto: true, url: 'https://awa.github.io/mon-site/' });
  });
});
