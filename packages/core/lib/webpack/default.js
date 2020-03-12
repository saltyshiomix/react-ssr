import React from 'react';
import ReactDOM from 'react-dom';
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

ReactDOM.hydrate(
  <App children={Page} {...getProps()} />,
  document.getElementById('react-ssr-root'),
);

if (module.hot) {
  module.hot.accept();
}
