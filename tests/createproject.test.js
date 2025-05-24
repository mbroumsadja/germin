const fs = require('fs').promises;
const path = require('path');
const { create_project } = require('../src/create_project');
const rimraf = require('rimraf').sync;

jest.mock('inquirer', () => ({
  prompt: jest.fn().mockResolvedValue({
    project_name: 'germin-project',
    js_type: true,
    init_git: true,
    github_repo: true,
  }),
}));

jest.mock('child_process', () => ({
  exec: jest.fn().mockImplementation((cmd, options, callback) => callback(null, { stdout: '', stderr: '' })),
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
    expect(files).toContain('src');
    expect(files).toContain('README.md');
    expect(files).toContain('package.json');

    const srcFiles = await fs.readdir(path.join(project_path, 'src'));
    expect(srcFiles).toContain('components');
    expect(srcFiles).toContain('styles');
    expect(srcFiles).toContain('utils');

    const stylesFiles = await fs.readdir(path.join(project_path, 'src', 'styles'));
    expect(stylesFiles).toContain('main.css');

    const componentsFiles = await fs.readdir(path.join(project_path, 'src', 'components'));
    expect(componentsFiles).toContain('App.js');
    
    const utilsFiles = await fs.readdir(path.join(project_path, 'src', 'utils'));
    expect(utilsFiles).toContain('helpers.js');
  });
});
