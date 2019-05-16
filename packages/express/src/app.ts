import express, { Application } from 'express';
import { Config } from './config';

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
    console.log('fired');

    if (args.length === 0) {
      throw new Error('1 - 4 arguments must be specified.');
    }

    const [port, ...rest] = args;
    return _listen(port, ...rest);
  };

  return app;
}
