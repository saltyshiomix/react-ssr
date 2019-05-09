import express, { Application } from 'express';
import { Config } from './config';

export class ReactSsrExpress {
  private readonly app: Application;
  private readonly config: Config;

  private readonly originalListen: any;

  constructor(config: Config = {}) {
    this.app = express();
    this.originalListen = this.app.listen;

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

    this.app.listen = this.listen;
  }

  getApp(): Application {
    return this.app;
  }

  private listen(port: number, hostname: string, backlog: number, callback?: Function): import('http').Server;
  private listen(port: number, hostname: string, callback?: Function): import('http').Server;
  private listen(port: number, callback?: Function): import('http').Server;
  private listen(path: string, callback?: Function): import('http').Server;
  private listen(handle: any, listeningListener?: Function): import('http').Server;
  private listen(port: any, hostname?: any, backlog?: any, callback?: any) {
    if (this.app._router) {
      for (let i = 0; i < this.app._router.stack.length; i++) {
        const r = this.app._router.stack[i];
        console.log(r);
      }
    }
    return this.originalListen(port, hostname, backlog, callback);
  }
}
