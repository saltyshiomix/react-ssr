#!/usr/bin/env node

const { resolve } = require('path');
const arg = require('arg');
const chalk = require('chalk');
const delay = require('delay');
const spawn = require('cross-spawn');

const args = arg({
  '--mode': String,
});

if (!args['--mode']) {
  console.log(chalk.red(`
  The "--mode" option must be specified!

    ex) build server.js --mode development
`));
  process.exit(1);
}

if (!args._[0]) {
  console.log(chalk.red(`
  A server endpoint must be specified!

    ex.) build server.js --mode production
`));
  process.exit(1);
}

let completed = false;
const cwd  = process.cwd();
const server = resolve(cwd, args._[0]);

const startProcess = async () => {
  const proc = spawn('node', [server], { cwd, stdio: 'inherit' });
  proc.on('exit', (code) => {
    if (code === 0) {
      completed = true;
    }
    process.exit(0);
  });
  proc.on('error', (err) => {
    // ignore
  });
  return proc;
};

process.env.NODE_ENV = args['--mode'];
process.env.REACT_SSR = 'BUILD';

startProcess();

(async () => {
  while (true) {
    if (completed) {
      break;
    }
    await delay(300);
  }
})();
