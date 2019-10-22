import React from 'react';
import ReactDOMServer from 'react-dom/server';
import SSR from './ssr';
import Config from './config';
import {
  getPageId,
  babelRequire,
} from './utils';

const codec = require('json-url')('lzw');
const escaperegexp = require('lodash.escaperegexp');

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

let moduleDetectRegEx: RegExp;

const renderFile = async (file: string, options: any, cb: (err: any, html?: any) => void) => {
  if (!moduleDetectRegEx) {
    const pattern = [].concat(options.settings.views).map(viewPath => '^' + escaperegexp(viewPath)).join('|');
    moduleDetectRegEx = new RegExp(pattern);
  }

  const { settings, cache, _locals, ...props } = options;
  try {
    return cb(undefined, await render(file, props, config));
  } catch (e) {
    return cb(e);
  } finally {
    Object.keys(require.cache).forEach((filename) => {
      if (moduleDetectRegEx.test(filename)) {
        delete require.cache[filename];
      }
    });
  }
};

export default renderFile;
