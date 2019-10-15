import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import ReactHtmlParser from 'react-html-parser';
import Html from './html';
import { getEngine } from './utils';

const ext = '.' + getEngine();
const codec = require('json-url')('lzw');

const render = async (file: string, props: object): Promise<string> => {
  const [, ...rest] = file.replace(process.cwd(), '').replace(ext, '.js').split(path.sep);
  const route: string = '/_react-ssr/' + rest.join('/');

  let Page = require(file);
  Page = Page.default || Page;

  console.log('RENDER.TSX:');
  console.log(ReactDOMServer.renderToString(<Page {...props} />));

  let html = '<!DOCTYPE html>';
  html += ReactDOMServer.renderToString(
    <Html route={route} props={await codec.compress(props)}>
      <Page {...props} />
    </Html>
  );

  return html;
};

export default render;
