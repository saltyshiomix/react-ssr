import React from 'react';
import ReactDOMServer from 'react-dom/server';
import cheerio from 'cheerio';
import {
  convertAttrToString,
  getHeadHtml,
} from './helpers';

const Head = require('./head');
const { ServerStyleSheets } = require('@material-ui/core/styles');

export default (app: React.ReactElement, script: string, style: string) => {
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
    <link rel="stylesheet" href="${style}">
    <style id="jss-server-side">${css}</style>
  </head>
  <body${convertAttrToString($('body').attr())}>
    <div id="react-ssr-root">${bodyWithoutScriptTags}</div>
    <script src="${script}"></script>
    ${scriptTags}
  </body>
</html>
`;
};
