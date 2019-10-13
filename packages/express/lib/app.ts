import { Server } from 'http';
import express from 'express';
import register from './register';
import { Config } from './config';

type Express = typeof express;

interface IReactSsrExpress extends Express {
  (config?: Config): express.Express;
}

const ctor = (config?: Config): express.Express => {
  const app: express.Express = express();

  function listen(port: number, hostname: string, backlog: number, callback?: (...args: any[]) => void): Server;
  function listen(port: number, hostname: string, callback?: (...args: any[]) => void): Server;
  function listen(port: number, callback?: (...args: any[]) => void): Server;
  function listen(callback?: (...args: any[]) => void): Server;
  function listen(path: string, callback?: (...args: any[]) => void): Server;
  function listen(handle: any, listeningListener?: () => void): Server;
  function listen(...args: any[]): Server {
    console.log('Optimizing performance...');
    console.log(args);
    // console.log(express.application.listen.arguments);
    console.log(arguments);
    return express.application.listen(...args);
  }
  app.listen = listen;

  // app.listen = express.application.listen;

  register(app, Object.assign(new Config, config));

  return app;
};

const ReactSsrExpress: IReactSsrExpress = ctor as IReactSsrExpress;

ReactSsrExpress.prototype = express.prototype;

export {
  ReactSsrExpress,
};
