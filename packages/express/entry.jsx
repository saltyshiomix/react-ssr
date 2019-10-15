import React from 'react';
import ReactDOM from 'react-dom';
import Page from './page';

if ('__REACT_SSR_DEVELOPMENT__') {
  require('reload/lib/reload-client');
}

const props = JSON.parse('__REACT_SSR__');

ReactDOM.hydrate(<Page {...props} />, document.getElementById('app'));
