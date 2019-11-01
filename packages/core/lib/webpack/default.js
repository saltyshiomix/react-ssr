import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import Page from '__REACT_SSR_PAGE__';

const props = JSON.parse('__REACT_SSR_PROPS__');
const html = ReactDOMServer.renderToStaticMarkup(<Page {...props} />);
const withHtml = 0 <= html.indexOf('html');
const container = withHtml ? document : document.getElementById('react-ssr-root');

// ReactDOM.hydrate(<Page {...props} />, container);

if (module.hot) {
  module.hot.accept();
}
