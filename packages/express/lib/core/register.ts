import path from 'path';
import http from 'http';
import express from 'express';
import renderFile from './render';
import optimize from './optimize';
import Config from './config';
import { getEngine } from './utils';

const register = async (app: express.Application, overrideConfig?: Config): Promise<void> => {
  const config: Config = Object.assign(new Config, overrideConfig || {});
  const engine: 'jsx' | 'tsx' = getEngine();

  app.engine(engine, renderFile);
  app.set('views', path.join(process.cwd(), config.viewsDir));
  app.set('view engine', engine);

  app.listen = function() {
    const args: any = arguments;
    const server = http.createServer(app);
    optimize(app, server, config).then((server) => {
      server.listen.apply(server, args);
    });
    return server;
  };
};

export default register;
