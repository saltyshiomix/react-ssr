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

const cwd  = process.cwd();
const server = resolve(cwd, args._[0]);

const startProcess = async () => {
  const proc = spawn('node', [server], { cwd, stdio: 'ignore' });
  proc.on('close', (code, signal) => {
    if (code !== null) {
      process.exit(code);
    }
    if (signal) {
      if (signal === 'SIGKILL') {
        process.exit(137);
      }
      process.exit(1);
    }
    process.exit(0);
  });
  proc.on('error', (err) => {
    console.log(chalk.red(err));
    process.exit(1);
  });
  return proc;
};

let proc;
const wrapper = () => {
  if (proc) {
    proc.kill();
  }
};

process.on('SIGINT', wrapper);
process.on('SIGTERM', wrapper);
process.on('exit', wrapper);

process.env.NODE_ENV = args['--mode'];
process.env.REACT_SSR_STATUS = 'STARTED';

proc = startProcess();

(async () => {
  while (true) {
    if (process.env.REACT_SSR_STATUS === 'COMPLETED') {
      break;
    }
    await delay(300);
  }
})();
