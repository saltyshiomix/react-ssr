import React from 'react';
import ReactDOMServer from 'react-dom/server';
import SSR from './ssr';
import Config from './config';
import {
  getPageId,
  babelRequire,
} from './utils';

const codec = require('json-url')('lzw');

const render = async (file: string, props: object, config: Config): Promise<string> => {
  let Page = babelRequire(file);
  Page = Page.default || Page;

  let html = '<!DOCTYPE html>';
  html += ReactDOMServer.renderToStaticMarkup(
    <SSR script={`/_react-ssr/${getPageId(file, config, '/')}.js?props=${await codec.compress(props)}`}>
      <Page {...props} />
    </SSR>
  );

  return html;
};

export default render;
