import React from 'react';
import ReactDOMServer from 'react-dom/server';
import cheerio from 'cheerio';
import {
  convertAttrToString,
  getHeadHtml,
} from './helpers';

const Head = require('./head');

export default (app: React.ReactElement, script: string) => {
  const html = ReactDOMServer.renderToString(app);
  const $ = cheerio.load(html);

  return `
<!DOCTYPE html>
<html${convertAttrToString($('html').attr())}>
  <head>
    ${getHeadHtml(Head.rewind())}
  </head>
  <body${convertAttrToString($('body').attr())}>
    <div id="react-ssr-root">${$('body').html() || ''}</div>
    <script src="${script}"></script>
  </body>
</html>
`;
};
