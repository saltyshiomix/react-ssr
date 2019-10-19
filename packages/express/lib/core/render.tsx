import React from 'react';
import ReactDOMServer from 'react-dom/server';
import SSR from './ssr';
import Config from './config';
import { getPageId } from './utils';

React.useLayoutEffect = () => {};

const codec = require('json-url')('lzw');

const render = async (file: string, props: object, config: Config): Promise<string> => {
  const script = `/_react-ssr/${getPageId(file, config, '/')}.js?props=${await codec.compress(props)}`;

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
