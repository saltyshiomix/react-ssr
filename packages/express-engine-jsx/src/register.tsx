import { readFile, outputFileSync } from 'fs-extra';
import { sep, resolve } from 'path';
import express, { Application } from 'express';
import template from 'art-template';
import React from 'react';
import { renderToString } from 'react-dom/server';
import Html from './html';
import build from './build';

const ENGINE_NAME = 'react.jsx';
const cwd = process.cwd();

const getPagePath = (file: string, config: any) => {
  return file.split(sep + config.viewsDir + sep)[1].replace('.react.jsx', '.jsx');
};

const register = (app: Application, config: any) => {
  require('@babel/register')();

  app.engine(ENGINE_NAME, (file: string, options: any, cb: (err: any, content?: string) => void) => {
    readFile(file, async (err, content) => {
      if (err) return cb(err);

      const pagePath = getPagePath(file, config);
      const page = resolve(cwd, config.buildDir, config.viewsDir, pagePath);

      await outputFileSync(page, template.render(content.toString(), options));
      await build(page, config);

      let Component = require(page);
      Component = Component.default || Component;

      return cb(null, renderToString(
        <Html title={ENGINE_NAME} scriptName={pagePath.replace('.jsx', '.js')}>
          <Component />
        </Html>
      ));
    })
  });

  app.set('views', resolve(cwd, config.viewsDir));
  app.set('view engine', ENGINE_NAME);

  app.use(express.static(config.buildDir));
};

export default register;
