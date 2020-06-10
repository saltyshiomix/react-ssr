import React from 'react';
import ReactDOM from 'react-dom';
import { CacheProvider } from '@emotion/core';
import createCache from '@emotion/cache';
import LZString from 'lz-string';
import URLSafeBase64 from 'urlsafe-base64';
import App from '__REACT_SSR_APP__';
import Page from '__REACT_SSR_PAGE__';

const getProps = () => {
  const compressedProps = document.getElementById('react-ssr-script').dataset.props;
  const decoded = URLSafeBase64.decode(compressedProps);
  const decompressed = LZString.decompressFromUint8Array(decoded);
  return JSON.parse(decompressed);
}

const cache = createCache();

ReactDOM.render(
  <CacheProvider value={cache}>
    <App children={Page} {...getProps()} />
  </CacheProvider>,
  document.getElementById('react-ssr-root'),
);

if (module.hot) {
  module.hot.accept();
}
