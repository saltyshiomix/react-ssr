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
const pkg = path.join(__dirname, 'workspace/package.json');
const content = fse.readJSONSync(pkg);
content.dependencies['@react-ssr/core'] = path.join(__dirname, 'packages/core');
if (content.dependencies['@react-ssr/express']) {
  content.dependencies['@react-ssr/express'] = path.join(__dirname, 'packages/express');
}
if (content.dependencies['@react-ssr/nestjs-express']) {
  content.dependencies['@react-ssr/nestjs-express'] = path.join(__dirname, 'packages/nestjs-express');
}
fse.writeJSONSync(pkg, {...content}, {
  spaces: 2,
});

execSync('cd workspace');
execSync('yarn && yarn start', {
  cwd: path.join(__dirname, 'workspace'),
  stdio: 'inherit'
});
