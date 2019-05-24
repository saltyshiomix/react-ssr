import express, { Application } from 'express';
import register from './register';
import { Config } from './config';

export function ReactSsrExpress(config: Config = {}) {
  const app: Application = express();

  config = {
    ...(new Config),
    ...config,
  };

  register(app, config);

  return app;
}
