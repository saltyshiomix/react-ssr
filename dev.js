const {
  existsSync,
  copySync,
  removeSync,
} = require('fs-extra');
const { resolve } = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');

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

removeSync('workspace');
copySync(`examples/${example}`, 'workspace');
execSync('cd workspace');
execSync('yarn && yarn start', {
  cwd: resolve(__dirname, 'workspace'),
  stdio: 'inherit'
});
