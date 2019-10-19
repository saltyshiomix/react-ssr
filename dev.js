const { existsSync, copy, remove } = require('fs-extra');
const { resolve } = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');

async function dev() {
  let example = 'basic-jsx';
  if (3 <= process.argv.length) {
    const newExample = process.argv[2];
    if (!existsSync(resolve(__dirname, `examples/${newExample}`))) {
      console.log(chalk.red(`Not found examples/${newExample}`));
      console.log('');
      process.exit(1);
    }
    example = newExample;
  }

  await remove('workspace');
  await copy(`examples/${example}`, 'workspace');
  execSync('cd workspace');
  execSync('yarn && yarn start', {
    cwd: resolve(__dirname, 'workspace'),
    stdio: 'inherit'
  });
}

dev();
