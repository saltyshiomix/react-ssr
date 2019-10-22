import React from 'react';
import ReactDOMServer from 'react-dom/server';
import SSR from './ssr';
import Config from './config';
import { getPageId, getBabelrc } from './utils';

const codec = require('json-url')('lzw');

let babelRegistered = false;

const render = async (file: string, props: object, config: Config): Promise<string> => {
  if (!babelRegistered) {
    require('@babel/register')({
      presets: ["@babel/preset-react", "@babel/preset-env"]
      // extends: getBabelrc(),
      // ignore: [/node_modules/],
      // only: [process.cwd()],
    });
    require('@babel/polyfill')
    babelRegistered = true;
  }

  const script = `/_react-ssr/${getPageId(file, config, '/')}.js?props=${await codec.compress(props)}`;

  console.log('debug 1');
  console.log(getBabelrc());
  console.log(babelRegistered);

  let Page;
  try {
    Page = require(file);
  } catch (error) {
    console.log(error);
    return error;
  }
  
  console.log('debug 2');

  Page = Page.default || Page;

  let html = '<!DOCTYPE html>';
  html += ReactDOMServer.renderToStaticMarkup(
    <SSR script={script}>
      <Page {...props} />
    </SSR>
  );

  console.log(html);

  return html;
};

export default render;
