import React from 'react';
import ReactDOM from 'react-dom';
import Page from './page';

let renderMethod = ReactDOM.hydrate;

if ('__REACT_SSR_DEVELOPMENT__') {
  renderMethod = ReactDOM.render;
}

const props = JSON.parse('__REACT_SSR__');

renderMethod((
  <React.Fragment>
    <Page {...props} />
    {process.env.NODE_ENV === 'production' ? null : <script src="/reload/reload.js"></script>}
  </React.Fragment>
), document.getElementById('app'));
