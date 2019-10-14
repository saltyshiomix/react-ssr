import React from 'react';
import ReactDOM from 'react-dom';
import Page from './page';

const props = {
  '__REACT__': '__SSR__',
};

ReactDOM.hydrate(<Page {...props} />, document.getElementById('app'));
