import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Ssr } from './ssr';
import { Config } from './config';
import {
  getPageId,
  getBabelConfig,
} from './helpers';

const codec = require('json-url')('lzw');

require('@babel/register')({
  extensions: ['.js', '.jsx', '.ts', '.tsx',],
  ...(getBabelConfig())
})

export const render = async (file: string, props: object, config: Config): Promise<string> => {
  let Page = require(file);
  Page = Page.default || Page;

  let html = '<!DOCTYPE html>';
  html += ReactDOMServer.renderToStaticMarkup(
    <Ssr script={`/_react-ssr/${getPageId(file, config, '/')}.js?props=${await codec.compress(props)}`}>
      <Page {...props} />
    </Ssr>
  );

  return html;
};
