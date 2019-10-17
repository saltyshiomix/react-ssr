import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import ReactHtmlParser from 'react-html-parser';
import cheerio from 'cheerio';
import Page from './__REACT_SSR_PAGE_NAME__';

const props = JSON.parse('__REACT_SSR_PROPS__');
const html = ReactDOMServer.renderToString(<Page {...props} />);

const hydrateByEmotion = (html) => {
  const { hydrate } = require('emotion');
  const { extractCritical } = require('emotion-server');
  const { ids } = extractCritical(html);
  hydrate(ids);
};

const hasHtml = 0 <= html.indexOf('html');
const hasEmotion = 0 <= html.indexOf('emotion');

if (hasHtml) {
  if (hasEmotion) {
    hydrateByEmotion(html);
  } else {
    const $ = cheerio.load(html);
    const htmlAttr = $('html').attr();
    const bodyAttr = $('body').attr();
    const head = $('head').html();
    const body = $('body').html();
    ReactDOM.hydrate((
      <html {...htmlAttr}>
        <head>
          {ReactHtmlParser(head || '')}
        </head>
        <body {...bodyAttr}>
          {ReactHtmlParser(body || '')}
          <script src={route + `?props=${injectProps}`}></script>
          {process.env.NODE_ENV === 'production' ? null : <script src="/reload/reload.js"></script>}
        </body>
      </html>
    ), document);
  }
} else {
  if (hasEmotion) {
    hydrateByEmotion(html);
  } else {
    ReactDOM.hydrate(<Page {...props} />, document.getElementById('app'));
  }
}
