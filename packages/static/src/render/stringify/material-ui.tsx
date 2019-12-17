import React from 'react';
import ReactDOMServer from 'react-dom/server';
import cheerio from 'cheerio';
import {
  convertAttrToString,
  getHeadHtml,
} from './helpers';

const Head = require('./head');
const { ServerStyleSheets } = require('@material-ui/core/styles');

export default (app: React.ReactElement, pageId: string, props: string) => {
  const sheets = new ServerStyleSheets();
  const html = ReactDOMServer.renderToString(sheets.collect(app));
  const css = sheets.toString();

  const $ = cheerio.load(html);
  const scriptTags = $.html($('body script'));
  const bodyWithoutScriptTags = ($('body').html() || '').replace(scriptTags, '');

  return `
<!DOCTYPE html>
<html${convertAttrToString($('html').attr())}>
  <head>
    ${getHeadHtml(Head.rewind())}
    <link rel="stylesheet" href="/_react-ssr/${pageId}.css">
    <style id="jss-server-side">${css}</style>
  </head>
  <body${convertAttrToString($('body').attr())}>
    <div id="react-ssr-root">${bodyWithoutScriptTags}</div>
    <script id="react-ssr-script" src="/_react-ssr/${pageId}.js" data-props="${props}"></script>
    ${scriptTags}
  </body>
</html>`;
};
