import React from 'react';
import ReactDOMServer from 'react-dom/server';
import cheerio from 'cheerio';
import {
  convertAttrToString,
  getHeadHtml,
} from './helpers';

const Head = require('./head');

const { CacheProvider } = require('@emotion/core');
const emotionCache = require('@emotion/cache');
const emotionServer = require('create-emotion-server');
const createCache = emotionCache.default || emotionCache;
const createEmotionServer = emotionServer.default || emotionServer;
const cache = createCache();
const { extractCritical } = createEmotionServer(cache);

export default (app: React.ReactElement, script: string) => {
  const {
    html,
    css,
    ids,
  } = extractCritical(
    ReactDOMServer.renderToString(
      <CacheProvider value={cache}>
        {app}
      </CacheProvider>
    ),
  );

  const $ = cheerio.load(html);

  return `
<!DOCTYPE html>
<html${convertAttrToString($('html').attr())}>
  <head>
    ${getHeadHtml(Head.rewind())}
    ${$.html($('style'))}
    <style data-emotion-css="${ids.join(' ')}">${css}</style>
  </head>
  <body${convertAttrToString($('body').attr())}>
    <div id="react-ssr-root">${$('body').html() || ''}</div>
    <script src="${script}"></script>
    ${$.html($('script'))}
  </body>
</html>
`;
};
