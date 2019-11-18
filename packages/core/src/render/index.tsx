import fs from 'fs-extra';
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
const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const userDocumentPath = path.join(process.cwd(), config.viewsDir, `_document${ext}`);
const DocumentContext = require('./document-context');

let DocumentComponent: any;
if (fs.existsSync(userDocumentPath)) {
  const UserDocument = require(userDocumentPath);
  DocumentComponent = UserDocument.default || UserDocument;
} else {
  DocumentComponent = Document;
}

const getRenderToStringMethod = async () => {
  let method;
  switch (config.id) {
    case 'antd':
      method = (await import('./stringify/antd')).default;
      break;
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
  const pageId = getPageId(file, '_');
  const htmlPath = path.join(process.cwd(), config.distDir, `${pageId}.html`);
  if (env === 'production' && fs.existsSync(htmlPath)) {
    return fs.readFileSync(htmlPath).toString();
  }

  let Page = require(file);
  Page = Page.default || Page;

  let html = 'Error when rendering HTML';
  try {
    html = (await getRenderToStringMethod())(
      <DocumentContext.Provider value={<Page {...props} />}>
        <DocumentComponent />
      </DocumentContext.Provider>,
      `/_react-ssr/${pageId}.js?props=${await codec.compress(props)}`,
      `/_react-ssr/${pageId}.css`,
    );
    return html;
  } finally {
    if (env === 'production') {
      fs.outputFileSync(htmlPath, html);
    }
  }
};
