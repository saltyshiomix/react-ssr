import React from 'react';
import ReactDOMServer from 'react-dom/server';
import SSR from './ssr';
import Config from './config';
import {
  getPageId,
  getBabelPresetsAndPlugins,
} from './utils';

const codec = require('json-url')('lzw');
const Module = require('module');

const originalLoader = Module._load;
let babelRegistered = false;

Module._load = function(request: string, parent: NodeModule) {
  if (!parent) {
    return originalLoader.apply(this, arguments);
  }

  if (!babelRegistered) {
    require('@babel/register')({
      ...(getBabelPresetsAndPlugins()),
    });
    babelRegistered = true;
  }

  return originalLoader.apply(this, arguments);
};

const render = async (file: string, props: object, config: Config): Promise<string> => {
  let Page = require(file);
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
