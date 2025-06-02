const fs = require('fs').promises;
const path = require('path');
const { create_project } = require('../src/create_project');
const rimraf = require('rimraf').sync;
const jest = require('jest');

jest.mock('inquirer', () => ({
  prompt: jest.fn().mockResolvedValue({
    project_name: 'germin-project',
    project_type: 'Statique (HTML/CSS)',
    css_framework: 'CSS pur',
    optionel: false,
    include_pages: false,
    init_git: false,
    github_repo: false,
  }),
}));

jest.mock('child_process', () => ({
  exec: jest
    .fn()
    .mockImplementation((cmd, options, callback) =>
      callback(null, { stdout: '', stderr: '' })
    ),
}));

describe('create_project', () => {
  const project_path = path.join(process.cwd(), 'germin-project');

  beforeEach(() => {
    rimraf(project_path);
  });

  afterEach(() => {
    rimraf(project_path);
  });

  it('should create Germin project with correct structure', async () => {
    await create_project();

    const files = await fs.readdir(project_path);
    expect(files).toContain('index.html');
    expect(files).toContain('README.md');
    expect(files).toContain('package.json');

    const srcFiles = await fs.readdir(path.join(project_path, 'public'));
    expect(srcFiles).toContain('css');

    const xDir = await fs.readdir(path.join(project_path, 'x'));
    expect(xDir).toContain('scripts');

    const stylesFiles = await fs.readdir(
      path.join(project_path, 'public', 'css')
    );
    expect(stylesFiles).toContain('style.css');

    const xScriptFiles = await fs.readdir(
      path.join(project_path, 'x', 'scripts')
    );
    expect(xScriptFiles).toContain('build.js');

    const xFiles = await fs.readdir(path.join(project_path, 'x', ''));
    expect(xFiles).toContain('app.html');
  });
});
