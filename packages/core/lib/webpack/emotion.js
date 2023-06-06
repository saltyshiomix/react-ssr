import React from 'react';
import ReactDOM from 'react-dom';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import LZString from 'lz-string';
import App from '__REACT_SSR_APP__';
import Page from '__REACT_SSR_PAGE__';

const getProps = () => {
  const compressedProps = document.getElementById('react-ssr-script').dataset.props;
  const decompressed = LZString.decompressFromBase64(compressedProps);
  return JSON.parse(decompressed);
}

const cache = createCache({ key: "react-ssr" });

ReactDOM.render(
  <CacheProvider value={cache}>
    <App children={Page} {...getProps()} />
  </CacheProvider>,
  document.getElementById('react-ssr-root'),
);

if (module.hot) {
  module.hot.accept();
}
