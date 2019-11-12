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
    const $ = cheerio.load(html);
    const styleTags = sheet.getStyleTags() // or sheet.getStyleElement();

    return `
<!DOCTYPE html>
<html${convertAttrToString($('html').attr())}>
  <head>
    ${getHeadHtml(Head.rewind())}
    ${styleTags}
  </head>
  <body${convertAttrToString($('body').attr())}>
    <div id="react-ssr-root">${$('body').html() || ''}</div>
    <script src="${script}"></script>
  </body>
</html>
`;
  } catch (error) {
    console.error(error);
    return `<!DOCTYPE html><html><body>${error}</body></html>`;
  } finally {
    sheet.seal();
  }
};
