import React from 'react';
import ReactDOM from 'react-dom';
import Page from './page';

let mount = ReactDOM.hydrate;

if ('__REACT_SSR_DEVELOPMENT__') {
  mount = ReactDOM.render;
  require('reload/lib/reload');
}

const props = JSON.parse('__REACT_SSR__');

mount((
  <React.Fragment>
    <Page {...props} />
    {process.env.NODE_ENV === 'production' ? null : <script src="/reload/reload.js"></script>}
  </React.Fragment>
), document.getElementById('app'));
