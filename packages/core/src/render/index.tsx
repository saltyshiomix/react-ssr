import fs from 'fs';
import path from 'path';
import React from 'react';
import Document from '../components/Document';
import {
  getSsrConfig,
  getEngine,
  getPageId,
} from '../helpers';

const codec = require('json-url')('lzw');

require('@babel/register')({
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
});

const config = getSsrConfig();
const ext = `.${getEngine()}`;
const userDocumentPath = path.join(process.cwd(), config.viewsDir, `_document${ext}`);
const DocumentContext = require('./document-context');

const getRenderToStringMethod = async () => {
  let method;
  switch (config.id) {
    case 'emotion':
      method = (await import('./stringify/emotion')).default;
      break;
    case 'material-ui':
      method = (await import('./stringify/material-ui')).default;
      break;
    case 'styled-components':
      method = (await import('./stringify/styled-components')).default;
      break;
    default:
      method = (await import('./stringify/default')).default;
      break;
  }
  return method;
};

export default async function render(file: string, props: object): Promise<string> {
  let Page = require(file);
  Page = Page.default || Page;

  let DocumentComponent;
  if (fs.existsSync(userDocumentPath)) {
    const UserDocument = require(userDocumentPath);
    DocumentComponent = UserDocument.default || UserDocument;
  } else {
    DocumentComponent = Document;
  }

  const renderToString = await getRenderToStringMethod();

  const html = renderToString(
    <DocumentContext.Provider value={<Page {...props} />}>
      <DocumentComponent />
    </DocumentContext.Provider>,
    `/_react-ssr/${getPageId(file, '/')}.js?props=${await codec.compress(props)}`
  );

  return html;
};
