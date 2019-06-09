import express, { Express } from 'express';
import register from './register';
import { Config } from './config';

let ReactSsrExpress = express;

ReactSsrExpress.prototype.constructor = (config?: Config): Express => {
  const app: Express = express();

  register(app, {
    ...(new Config),
    ...config,
  });

  return app;
}

export {
  ReactSsrExpress,
};
