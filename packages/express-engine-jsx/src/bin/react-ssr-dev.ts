import { resolve } from 'path';
import arg from 'arg';
import chalk from 'chalk';
import delay from 'delay';
import got from 'got';
import serve from './serve';
import * as spinner from './spinner';

const args = arg({});

if (!args._[0]) {
  console.error(chalk.red('Please specify a server entrypoint: `react-ssr server.js`'));
  process.exit(1);
}

const cwd = process.cwd();
const server: string = resolve(cwd, args._[0]);

async function dev() {
  let proc;
  const wrapper = () => {
    if (proc) {
      proc.kill();
    }
  };
  process.on('SIGINT', wrapper);
  process.on('SIGTERM', wrapper);
  process.on('exit', wrapper);

  proc = serve(server, false);

  await delay(300);

  const app = module.exports.__REACT_SSR_EXPRESS__;

  app.listen(8888, async () => {
    const url = (route) => `http://localhost:8888${route}`;

    spinner.create(`Building '/'`);
    await got(url('/'));

    spinner.create(`Building '/' (test 2)`);
    await got(url('/'));

    spinner.create(`Building '/' (test 3)`);
    await got(url('/'));

    spinner.clear('Success!');

    if (proc) {
      proc.kill();
    }

    proc = serve(server, true);
  });
}

dev();
