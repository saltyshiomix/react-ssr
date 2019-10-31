import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Page from '__REACT_SSR_PAGE__';

const { hydrate } = require('emotion');
const { extractCritical } = require('emotion-server');

const props = JSON.parse('__REACT_SSR_PROPS__');
const html = ReactDOMServer.renderToString(<Page {...props} />);
const { ids } = extractCritical(html);

hydrate(ids);

if (module.hot) {
  module.hot.accept();
}
