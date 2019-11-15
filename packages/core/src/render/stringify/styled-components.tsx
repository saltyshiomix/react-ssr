import React from 'react';
import ReactDOMServer from 'react-dom/server';
import cheerio from 'cheerio';
import {
  convertAttrToString,
  getHeadHtml,
} from './helpers';

const Head = require('./head');

const { ServerStyleSheet } = require('styled-components');

export default (app: React.ReactElement, script: string) => {
  const sheet = new ServerStyleSheet();
  try {
    const html = ReactDOMServer.renderToString(sheet.collectStyles(app));
    const styleTags = sheet.getStyleTags();

    const $ = cheerio.load(html);
    const scriptTags = $.html($('body script'));
    const bodyWithoutScriptTags = ($('body').html() || '').replace(scriptTags, '');

    return `
<!DOCTYPE html>
<html${convertAttrToString($('html').attr())}>
  <head>
    ${getHeadHtml(Head.rewind())}
    ${styleTags}
  </head>
  <body${convertAttrToString($('body').attr())}>
    <div id="react-ssr-root">${bodyWithoutScriptTags}</div>
    <script src="${script}"></script>
    ${scriptTags}
  </body>
</html>
`;
  } finally {
    sheet.seal();
  }
};
