import { readFile, outputFileSync } from 'fs-extra';
import { sep, resolve } from 'path';
import express, { Application } from 'express';
import template from 'art-template';
import React from 'react';
import { renderToString } from 'react-dom/server';
import Html from './html';
import build from './build';

const ENGINE_NAME = 'jsx';
const cwd = process.cwd();

const getPagePath = (file: string, config: any) => {
  return file.split(sep + config.viewsDir + sep)[1];
};

const register = (app: Application, config: any) => {
  require('@babel/register')();

  app.engine(ENGINE_NAME, (file: string, options: any, cb: (err: any, content?: string) => void) => {
    readFile(file, async (err, content) => {
      if (err) return cb(err);

      // HACK: delete unnecessary server options
      const props = options;
      delete props.settings;
      delete props._locals;
      delete props.cache;

      let html: string = '<!DOCTYPE html>';
      const pagePath = getPagePath(file, config);
      const page = resolve(cwd, config.buildDir, config.viewsDir, pagePath);

      try {
        await outputFileSync(page, template.render(content.toString(), props));
        await build(page, config, props);

        let Page = require(page);
        Page = Page.default || Page;

        html += renderToString(
          <Html script={pagePath.replace('.jsx', '.js')}>
            <Page {...props} />
          </Html>
        );

        return cb(null, html);
      } catch (e) {
        return cb(e);
      }
    })
  });

  app.set('views', resolve(cwd, config.viewsDir));
  app.set('view engine', ENGINE_NAME);

  app.use(express.static(config.buildDir));
};

export default register;
