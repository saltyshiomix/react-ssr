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

export default (app: React.ReactElement, pageId: string, props: string) => {
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
  const scriptTags = $.html($('body script'));
  const bodyWithoutScriptTags = ($('body').html() || '').replace(scriptTags, '');

  return `<!DOCTYPE html><html${convertAttrToString($('html').attr())}><head>${getHeadHtml(Head.rewind())}<link rel="preload" href="/_react-ssr/${pageId}.css" as="style"><link rel="preload" href="/_react-ssr/${pageId}.js" as="script"><link rel="stylesheet" href="/_react-ssr/${pageId}.css"><style data-emotion-css="${ids.join(' ')}">${css}</style></head><body${convertAttrToString($('body').attr())}><div id="react-ssr-root">${bodyWithoutScriptTags}</div><script id="react-ssr-script" src="/_react-ssr/${pageId}.js" data-props="${props}" defer></script>${scriptTags}</body></html>`;
};
