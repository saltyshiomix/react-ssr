import React from 'react';
import ReactDOM from 'react-dom';
import Page from './page';

if ('__REACT_SSR_DEVELOPMENT__') {
  require('reload/lib/reload');
}

const props = JSON.parse('__REACT_SSR__');

ReactDOM.hydrate((
  <React.Fragment>
    <Page {...props} />
    {process.env.NODE_ENV === 'production' ? null : <script src="/reload/reload.js"></script>}
  </React.Fragment>
), document.getElementById('app'));
