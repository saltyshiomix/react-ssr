import React from 'react';
import ReactDOM from 'react-dom';
import Page from './{{page}}';

const props = {{@props}};

ReactDOM.hydrate(<Page {...props} />, document.getElementById('app'));
