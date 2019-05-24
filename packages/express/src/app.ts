import { Server } from 'http';
import express, { Application } from 'express';
import delay from 'delay';
import got from 'got';
import register from './register';
import { Config } from './config';
import * as spinner from './spinner';

const buildSync = async (route: string) => {
  let done: boolean = false;

  try {
    spinner.create(`Building "${route}"`);
    await got(`http://localhost:8888${route}`);
    done = true;
  } catch (e) {
    spinner.fail(`Not found "${route}"!`);
    process.exit(1);
  }

  while (true) {
    if (done) {
      break;
    }
    await delay(30);
  }
};

const buildStaticPages = async (app: Application) => {
  let done: boolean = false;

  const server = app.listen(8888, async () => {
    await delay(150); // wait until .jsx|.tsx view engine is registered
    for (let i = 0; i < app._router.stack.length; i++) {
      const r = app._router.stack[i];
      if (r.route && r.route.path) {
        if (r.route.methods.get) {
          await buildSync(r.route.path);
        }
      }
    }
    done = true;
  });

  while (true) {
    if (done) {
      break;
    }
    await delay(30);
  }

  server.close();

  spinner.clear('All static pages are generated!');
  console.log('');

  process.exit(0);
};

export function ReactSsrExpress(config: Config = {}) {
  const app: Application = express();

  config = {
    ...(new Config),
    ...config,
  };

  register(app, config);

  if (process.env.REACT_SSR === 'BUILD') {
    buildStaticPages(app);

    // disable app.listen()
    app.listen = (): Server => new Server;
  }

  return app;
}
