import React from 'react';
import ReactDOM from 'react-dom';
import Page from './page';

if ('__REACT_SSR_DEVELOPMENT__') {
  const { hot } = require('react-hot-loader/root');
  Page = hot(Page);
}

const props = JSON.parse('__REACT_SSR__');

ReactDOM.hydrate(<Page {...props} />, document.getElementById('app'));
