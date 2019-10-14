import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import Html from './html';

const codec = require('json-url')('lzw');

const render = async (file: string, props: any): Promise<string> => {
  const [, ...rest] = file.replace(process.cwd(), '').split(path.sep);
  const route: string = '/_react-ssr/' + rest.join('/');
  const compressedProps: string = await codec.compress(props);

  let Page = require(file);
  Page = Page.default || Page;

  let html = '<!DOCTYPE html>';
  html += renderToString(
    <Html route={route} props={compressedProps}>
      <Page {...props} />
    </Html>
  );

  console.log('');
  console.log(`ROUTE: ${route}`);
  console.log('');

  console.log('');
  console.log('COMPRESSED_PROPS:');
  console.log(compressedProps);
  console.log('');

  console.log('');
  console.log('PROPS:');
  console.log(props);
  console.log('');

  console.log('');
  console.log('HTML:');
  console.log(html);
  console.log('');

  return html;
};

export default render;
