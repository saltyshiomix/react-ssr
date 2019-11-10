import React from 'react';
import ReactDOM from 'react-dom';
import Page from '__REACT_SSR_PAGE__';

const props = JSON.parse('__REACT_SSR_PROPS__');

ReactDOM.hydrate(<Page {...props} />, document.getElementById('react-ssr-root'));

if (module.hot) {
  module.hot.accept();
}
