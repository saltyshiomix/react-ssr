const fse = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

let example = 'basic-jsx';
if (3 <= process.argv.length) {
  const newExample = process.argv[2];
  if (!fse.existsSync(path.join(__dirname, `examples/${newExample}`))) {
    console.log(`Not found examples/${newExample}`);
    console.log('');
    process.exit(1);
  }
  example = newExample;
}

fse.removeSync('workspace');

fse.copySync(`examples/${example}`, 'workspace');
execSync('cd workspace');
execSync('npm install && npm start', {
  cwd: path.join(__dirname, 'workspace'),
  stdio: 'inherit'
});
