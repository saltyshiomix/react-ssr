import {
  remove,
  existsSync,
  readFileSync,
  outputFileSync,
} from 'fs-extra';
import {
  sep,
  basename,
  resolve,
} from 'path';
import template from 'art-template';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Config } from '@react-ssr/express';
import Html from './html';
import rollup from './rollup';

template.defaults.minimize = false;

const getPagePath = (file: string, config: Config): string => {
  return file.split(sep + config.viewsDir + sep)[1];
};

const render = async (file: string, config: Config, props: any): Promise<string> => {
  let html: string = '<!DOCTYPE html>';

  const cwd: string = process.cwd();
  const buildDir: string = config.buildDir as string;
  const ssrDir: string = '_react-ssr';
  const pagePath: string = getPagePath(file, config);

  const cache: string = resolve(cwd, buildDir, ssrDir, pagePath.replace('.jsx', '.html'));
  if (existsSync(cache)) {
    return readFileSync(cache).toString();
  }

  const page: string = resolve(cwd, buildDir, ssrDir, pagePath);
  const input: string = page.replace('.jsx', '.page.jsx');

  try {
    await outputFileSync(page, template(file, props));
    await outputFileSync(input, template(resolve(__dirname, 'client.jsx'), { page: basename(page).replace('.jsx', ''), props }));

    await (await rollup(input)).write({
      file: input.replace('.page.jsx', '.js'),
      format: 'iife',
      name: 'ReactSsrExpress',
    });

    let Page = require(page);
    Page = Page.default || Page;

    html += renderToString(
      <Html script={pagePath.replace('.jsx', '.js')}>
        <Page {...props} />
      </Html>
    );

    return html;

  } finally {
    await outputFileSync(cache, html);

    await remove(page);
    await remove(input);
  }
};

export default render;
