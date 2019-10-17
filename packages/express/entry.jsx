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
const ssrId = document.body.dataset.reactSsrId;

console.log('ssrId:');
console.log(ssrId);

if (hasHtml) {
  if (ssrId === 'emotion') {
    hydrateByEmotion(html);
  } else {
    const $ = cheerio.load(html);
    const body = $('body').html();
    ReactDOM.hydrate((
      <React.Fragment>
        {ReactHtmlParser(body || '')}
      </React.Fragment>
    ), document.getElementById('react-ssr-root'));
  }
} else {
  if (ssrId === 'emotion') {
    hydrateByEmotion(html);
  } else {
    ReactDOM.hydrate(<Page {...props} />, document.getElementById('react-ssr-root'));
  }
}
