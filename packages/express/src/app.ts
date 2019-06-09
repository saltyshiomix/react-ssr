import express from 'express';
import register from './register';
import { Config } from './config';

type Express = typeof express;

interface IReactSsrExpress extends Express {
  (config?: Config): express.Express;
}

const ctor = (config?: Config): express.Express => {
  const app: express.Express = express();

  register(app, {
    ...(new Config),
    ...config,
  });

  return app;
};

const ReactSsrExpress: IReactSsrExpress = express;

ReactSsrExpress.prototype.constructor = ctor;

export {
  ReactSsrExpress,
};
