import React from 'react';
import ReactDOMServer from 'react-dom/server';
import SSR from './ssr';
import Config from './config';
import {
  getEngine,
  getPageId,
} from './utils';

const ext = '.' + getEngine();
const codec = require('json-url')('lzw');

const render = async (file: string, props: object, config: Config): Promise<string> => {
  const pageId = getPageId(file, config, '/');
  const script = `/_react-ssr/${pageId}.js?props=${await codec.compress(props)}`;

  let Page = require(file);
  Page = Page.default || Page;

  let html = '<!DOCTYPE html>';
  html += ReactDOMServer.renderToString(
    <SSR script={script}>
      <Page {...props} />
    </SSR>
  );

  return html;
};

export default render;
