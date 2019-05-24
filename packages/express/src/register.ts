import { remove, outputFile } from 'fs-extra';
import { resolve } from 'path';
import express, { Application } from 'express';
import babelrc from './babelrc';
import engine from './engine';
import render from './render';
import { Config } from './config';
import { getPagePath } from './utils';

require('@babel/register')({ extends: babelrc() });

const register = async (app: Application, config: Config): Promise<void> => {
  const cwd: string = process.cwd();
  const { distDir, viewsDir } = config;
  if (process.env.REACT_SSR === 'BUILD') {
    await remove(distDir as string);
  }

  const renderFile = async (file: string, options: any, cb: any) => {
    let html: string|undefined;
    try {
      // HACK: delete unnecessary server options
      const props: any = options;
      delete props.settings;
      delete props._locals;
      delete props.cache;
      html = await render(file, config, props);
      return cb(null, html);
    } catch (e) {
      return cb(e);
    } finally {
      if (!html) {
        return;
      }
      await outputFile(resolve(cwd, distDir as string, getPagePath(file, viewsDir as string)), html);
    }
  };

  const ENGINE: 'jsx'|'tsx' = engine();
  app.engine(ENGINE, renderFile);
  app.set('views', resolve(process.cwd(), viewsDir as string));
  app.set('view engine', ENGINE);
  app.use(express.static(distDir as string));
};

export default register;
