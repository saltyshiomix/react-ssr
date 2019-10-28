import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Ssr, Head } from './ssr';
import { getPageId } from './helpers/core';
import { getBabelConfig } from './helpers/babel';

const codec = require('json-url')('lzw');

require('@babel/register')({
  extensions: ['.js', '.jsx', '.ts', '.tsx',],
  ...(getBabelConfig()),
});

export const render = async (file: string, props: object): Promise<string> => {
  let Page = require(file);
  Page = Page.default || Page;

  let html = '<!DOCTYPE html>';
  html += ReactDOMServer.renderToStaticMarkup(
    <Ssr script={`/_react-ssr/${getPageId(file, '/')}.js?props=${await codec.compress(props)}`}>
      <Page {...props} />
    </Ssr>
  );

  console.log(Head.elements);

  return html;
};
