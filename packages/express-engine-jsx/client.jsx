import React from 'react';
import ReactDOM from 'react-dom';
import Page from './{{page}}';

const props = JSON.parse('{{@props | JSON.stringify}}');

ReactDOM.hydrate(<Page {...props} />, document.getElementById('app'));
