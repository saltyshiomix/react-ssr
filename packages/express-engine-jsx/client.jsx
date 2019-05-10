import React from 'react';
import ReactDOM from 'react-dom';
import Page from './react-ssr-page';
import props from './react-ssr-props';

ReactDOM.hydrate(<Page {...props} />, document.getElementById('app'));
