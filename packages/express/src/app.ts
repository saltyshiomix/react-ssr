import express, { Application } from 'express';
import { Config } from './config';

export class ReactSsrExpress {
  private readonly app: Application;
  private readonly config: Config;

  constructor(config: Config = {}) {
    this.app = express();
    this.config = {
      ...(new Config),
      ...config,
    };

    if (!this.config.engine) {
      throw new Error('InvalidProgramException: view engine must be specified.');
    }

    if (!['jsx', 'tsx'].includes(this.config.engine)) {
      throw new Error(`The engine ${this.config.engine} is not supported.`);
    }

    require(`@react-ssr/express-engine-${this.config.engine}`)(this.app, this.config);
  }

  getApp(): Application {
    return this.app;
  }
}
