import express, { Application } from 'express';
import register from './register';
import { Config } from './config';

export function ReactSsrExpress(config: Config = {}) {
  const app: Application = express();

  register(app, {
    ...(new Config),
    ...config,
  });

  return app;
}
