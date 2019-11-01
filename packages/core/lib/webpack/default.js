import React from 'react';
import ReactDOM from 'react-dom';
import Page from '__REACT_SSR_PAGE__';
import { hasHtml } from '__REACT_SSR_HELPERS__';

const props = JSON.parse('__REACT_SSR_PROPS__');

const Clone = React.cloneElement(Page, Object.assign(props, {
  ref: node => {
    this._input = node;
    const { ref } = Page;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  }
}));

const container = hasHtml(Clone) ? document : document.getElementById('react-ssr-root');

ReactDOM.hydrate(<Page {...props} />, container);

if (module.hot) {
  module.hot.accept();
}
