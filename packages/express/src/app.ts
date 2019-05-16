import express, { Application } from 'express';
import delay from 'delay';
import got from 'got';
import { Config } from './config';
import * as spinner from './spinner';

const buildSync = async (route: string) => {
  let done: boolean = false;

  try {
    spinner.create(`Building "${route}"`);
    await got(`http://localhost:8888${route}`);
    done = true;
  } catch (e) {
    spinner.fail(e.response.body);
    process.exit(1);
  }

  while (true) {
    if (done) {
      break;
    }
    await delay(150);
  }
};

const buildStaticPages = async (app: Application) => {
  let done: boolean = false;

  const server = app.listen(8888, async () => {
    const routes: string[] = [];
    for (let i = 0; i < app._router.stack.length; i++) {
      const r = app._router.stack[i];
      if (r.route && r.route.path) {
        if (r.route.methods.get) {
          await buildSync(r.route.path);
        }
        routes.push(r.route.path);
      }
    }
    done = true;
  });

  while (true) {
    if (done) {
      break;
    }
    await delay(300);
  }

  server.close();

  process.env.REACT_SSR_STATUS = 'COMPLETED';
  spinner.clear('All static pages are generated!');
};

export function ReactSsrExpress(config: Config = {}) {
  const app: Application = express();

  config = {
    ...(new Config),
    ...config,
  };

  if (!config.engine) {
    throw new Error('InvalidProgramException: view engine must be specified.');
  }

  if (!['jsx', 'tsx'].includes(config.engine)) {
    throw new Error(`The engine ${config.engine} is not supported.`);
  }

  require(`@react-ssr/express-engine-${config.engine}`)(app, config);

  if (process.env.REACT_SSR_STATUS === 'STARTED') {
    buildStaticPages(app);
  }

  return app;
}
