const fs = require('fs').promises;
const path = require('path');
const { createProject } = require('../src/createProject');
const rimraf = require('rimraf').sync;

jest.mock('inquirer', () => ({
  prompt: jest.fn().mockResolvedValue({
    projectName: 'test-project',
    includeJs: true,
    initGit: false,
    githubRepo: false,
  }),
}));

jest.mock('child_process', () => ({
  exec: jest.fn().mockImplementation((cmd, options, callback) => callback(null, { stdout: '', stderr: '' })),
}));

describe('createProject', () => {
  const projectPath = path.join(process.cwd(), 'test-project');

  beforeEach(() => {
    rimraf(projectPath);
  });

  afterEach(() => {
    rimraf(projectPath);
  });

  it('should create project with correct structure', async () => {
    await createProject();

    const files = await fs.readdir(projectPath);
    expect(files).toContain('index.html');
    expect(files).toContain('public');
    expect(files).toContain('README.md');
    expect(files).toContain('TODO.md');
    expect(files).toContain('package.json');

    const publicFiles = await fs.readdir(path.join(projectPath, 'public'));
    expect(publicFiles).toContain('css');
    expect(publicFiles).toContain('js');

    const cssFiles = await fs.readdir(path.join(projectPath, 'public', 'css'));
    expect(cssFiles).toContain('style.css');

    const jsFiles = await fs.readdir(path.join(projectPath, 'public', 'js'));
    expect(jsFiles).toContain('script.js');
  });
});