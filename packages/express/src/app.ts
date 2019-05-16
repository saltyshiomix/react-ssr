import express, { Application } from 'express';
import delay from 'delay';
import got from 'got';
import { Config } from './config';
import * as spinner from './spinner';

let built: boolean = false;

async function waitUntilBuilt() {
  while (!built) {
    await delay(300);
  }
}

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

  const _listen = app.listen;
  app.listen = (...args: any[]) => {
    if (args.length === 0) {
      throw new Error('1 - 4 arguments must be specified.');
    }

    const server = _listen(8888, async () => {
      const url = (route: string) => `http://localhost:8888${route}`;

      console.log(app._router);

      spinner.create(`Building '/'`);
      await got(url('/'));

      spinner.create(`Building '/' (test 2)`);
      await got(url('/'));

      spinner.create(`Building '/' (test 3)`);
      await got(url('/'));

      built = true;
    });

    waitUntilBuilt();

    server.close();

    const [port, ...rest] = args;
    spinner.clear(`> Ready on http://localhost:${port}`);

    return _listen(port, ...rest);
  };

  return app;
}
