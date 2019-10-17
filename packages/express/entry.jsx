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

console.log('hasEmotion:');
console.log(hasEmotion);
console.log(html);

if (hasHtml) {
  if (hasEmotion) {
    hydrateByEmotion(html);
  } else {
    hydrateByEmotion(html);
    // const $ = cheerio.load(html);
    // const body = $('body').html();
    // ReactDOM.hydrate((
    //   <React.Fragment>
    //     {ReactHtmlParser(body || '')}
    //   </React.Fragment>
    // ), document.getElementById('react-ssr-root'));
  }
} else {
  if (hasEmotion) {
    hydrateByEmotion(html);
  } else {
    ReactDOM.hydrate(<Page {...props} />, document.getElementById('react-ssr-root'));
  }
}
