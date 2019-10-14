import React from 'react';
import ReactDOM from 'react-dom';
import Page from './page';

let App = Page;
if ('__REACT_SSR_DEVELOPMENT__') {
  const { hot } = require('react-hot-loader/root');
  App = hot(Page);
}

const props = JSON.parse('__REACT_SSR__');

ReactDOM.hydrate(<App {...props} />, document.getElementById('app'));
