import { remove } from 'fs-extra';
import { resolve } from 'path';
import express, { Application } from 'express';
import babelrc from './babelrc';
import render from './render';
import { Config } from './config';

const register = async (app: Application, config: Config): Promise<void> => {
  require('@babel/register')({ extends: babelrc() });

  const ENGINE: 'jsx'|'tsx' = config.engine as 'jsx'|'tsx';
  const cwd: string = process.cwd();
  const distDir: string = config.distDir as string;
  const viewsDir: string = config.viewsDir as string;

  if (process.env.REACT_SSR === 'BUILD') {
    await remove(distDir);
  }

  const renderFile = async (file: string, options: any, cb: any) => {
    try {
      // HACK: delete unnecessary server options
      const props: any = options;
      delete props.settings;
      delete props._locals;
      delete props.cache;
      return cb(null, await render(file, config, props));
    } catch (e) {
      return cb(e);
    }
  };

  app.engine(ENGINE, renderFile);
  app.set('views', resolve(cwd, viewsDir));
  app.set('view engine', ENGINE);
  app.use(express.static(distDir));
};

export default register;
