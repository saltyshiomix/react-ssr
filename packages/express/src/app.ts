import express from 'express';
import register from './register';
import { Config } from './config';

type Express = typeof express;

interface IReactSsrExpress extends Express {
  (config?: Config): express.Express;
}

const ctor = (config?: Config): express.Express => {
  const app: express.Express = express();

  register(app, Object.assign(new Config, config));

  return app;
};

const ReactSsrExpress: IReactSsrExpress = ctor as IReactSsrExpress;

ReactSsrExpress.prototype = express.prototype;

export {
  ReactSsrExpress,
};
