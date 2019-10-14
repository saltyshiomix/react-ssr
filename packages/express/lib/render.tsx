import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import Html from './html';
import { getEngine } from './utils';

const ext = '.' + getEngine();
const codec = require('json-url')('lzw');

const render = async (file: string, props: any): Promise<string> => {
  const [, ...rest] = file.replace(process.cwd(), '').replace(ext, '.js').split(path.sep);
  const route: string = '/_react-ssr/' + rest.join('/');

  let Page = require(file);
  Page = Page.default || Page;

  let html = '<!DOCTYPE html>';
  html += renderToString(
    <Html route={route} props={await codec.compress(props)}>
      <Page {...props} />
    </Html>
  );

  return html;
};

export default render;
