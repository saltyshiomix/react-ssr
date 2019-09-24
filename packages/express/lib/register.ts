import { resolve } from 'path';
import express, { Application } from 'express';
import render from './render';
import { Config } from './config';
import {
  getBabelrc,
  getEngine,
} from './utils';

require('@babel/register')({ extends: getBabelrc() });

const cwd: string = process.cwd();

const register = async (app: Application, config: Config): Promise<void> => {
  const { distDir, viewsDir } = config;

  const renderFile = async (file: string, options: any, cb: any) => {
    try {
      // HACK: delete unnecessary server options
      const { settings, cache, _locals, ...props } = options;
      return cb(null, await render(file, config, props));
    } catch (e) {
      return cb(e);
    }
  };

  const ENGINE: 'jsx'|'tsx' = getEngine();
  app.engine(ENGINE, renderFile);
  app.set('views', resolve(cwd, viewsDir as string));
  app.set('view engine', ENGINE);
  app.use(express.static(distDir as string));
};

export default register;
