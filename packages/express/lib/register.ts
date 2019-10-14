import path from 'path';
import http from 'http';
import express from 'express';
import render from './render';
import optimize from './optimize';
import Config from './config';
import {
  getBabelrc,
  getEngine,
} from './utils';

require('@babel/register')({ extends: getBabelrc() });

const register = async (app: express.Application, config: Config): Promise<void> => {
  const ENGINE: 'jsx' | 'tsx' = getEngine();

  const renderFile = async (file: string, options: any, cb: any) => {
    try {
      const { settings, cache, _locals, ...props } = options;
      return cb(null, await render(file, props));
    } catch (e) {
      return cb(e);
    }
  };

  app.engine(ENGINE, renderFile);
  app.set('views', path.join(process.cwd(), config.viewsDir));
  app.set('view engine', ENGINE);

  app.listen = function() {
    const args: any = arguments;
    const server = http.createServer(app);
    optimize(app, config).then(() => {
      server.listen.apply(server, args)
    });
    return server;
  };
};

export default register;
