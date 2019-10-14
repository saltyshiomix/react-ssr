import React from 'react';
import ReactDOM from 'react-dom';
import Page from './page';

const props = JSON.parse(__REACT_SSR__);

ReactDOM.hydrate(<Page {...props} />, document.getElementById('app'));
