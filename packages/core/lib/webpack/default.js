import React from 'react';
import ReactDOM from 'react-dom';
import Page from '__REACT_SSR_PAGE__';
import { hasHtml } from '__REACT_SSR_HELPERS__';

const props = JSON.parse('__REACT_SSR_PROPS__');
// const container = hasHtml(React.cloneElement(Page, props)) ? document : document.getElementById('react-ssr-root');
const withHtml = hasHtml(React.cloneElement(Page, props));

console.log(withHtml);

const container = withHtml ? document : document.getElementById('react-ssr-root');

ReactDOM.hydrate(<Page {...props} />, container);

if (module.hot) {
  module.hot.accept();
}
