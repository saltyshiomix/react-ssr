import fs from 'fs';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Document from './components/Document';
import {
  getSsrConfig,
  getEngine,
  getPageId,
} from './helpers';

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

  let html = '<!DOCTYPE html>';
  html += ReactDOMServer.renderToString(
    <DocumentContext.Provider value={{
      children: <Page {...props} />,
      script: `/_react-ssr/${getPageId(file, '/')}.js?props=${await codec.compress(props)}`,
    }}>
      <DocumentComponent />
    </DocumentContext.Provider>
  );

  return html;
};
