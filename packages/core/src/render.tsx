import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {
  getSsrConfig,
  getPageId,
} from './helpers/core';
import { getBabelConfig } from './helpers/babel';

const codec = require('json-url')('lzw');

require('@babel/register')({
  extensions: ['.js', '.jsx', '.ts', '.tsx',],
  ...(getBabelConfig()),
});

const config = getSsrConfig();

const getSsrComponent = async (): Promise<any> => {
  if (config.id === 'emotion') {
    return (await import('./ssr/emotion')).default;
  }
  if (config.id === 'material-ui') {
    return (await import('./ssr/material-ui')).default;
  }
  if (config.id === 'styled-components') {
    return (await import('./ssr/styled-components')).default;
  }
  return (await import('./ssr/default')).default;
};

export default async function render(file: string, props: object): Promise<string> {
  const SsrWrapper = await getSsrComponent();

  let Page = require(file);
  Page = Page.default || Page;

  let html = '<!DOCTYPE html>';
  html += ReactDOMServer.renderToString(
    <SsrWrapper script={`/_react-ssr/${getPageId(file, '/')}.js?props=${await codec.compress(props)}`}>
      <Page {...props} />
    </SsrWrapper>
  );

  return html;
};
