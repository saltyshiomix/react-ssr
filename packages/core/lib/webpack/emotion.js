import React from 'react';
import ReactDOM from 'react-dom';
import { CacheProvider } from '@emotion/core';
import createCache from '@emotion/cache';
import Page from '__REACT_SSR_PAGE__';

const props = JSON.parse('__REACT_SSR_PROPS__');

const cache = createCache();

ReactDOM.render((
  <CacheProvider value={cache}>
    <Page {...props} />
  </CacheProvider>
), document.getElementById('react-ssr-root'));

if (module.hot) {
  module.hot.accept();
}
