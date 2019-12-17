import fs from 'fs-extra';
import path from 'path';
import React from 'react';
import LZString from 'lz-string';
import URLSafeBase64 from 'urlsafe-base64';
import Document from '../components/Document';
import {
  getEngine,
  getPageId,
  staticConfig,
} from '../helpers';

require('@babel/register')({
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
});

const cwd = process.cwd();
const ext = `.${getEngine()}`;
const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const userDocumentPath = path.join(cwd, staticConfig.viewsDir, `_document${ext}`);
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
  switch (staticConfig.id) {
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

const compressProps = (props: any) => {
  const packed = JSON.stringify(props);
  const compressed = Buffer.from(LZString.compressToUint8Array(packed));
  return URLSafeBase64.encode(compressed);
}

export default async function render(file: string, props: object): Promise<string> {
  let Page = require(file);
  Page = Page.default || Page;

  const pageId = getPageId(file, '_');

  let html;
  try {
    html = (await getRenderToStringMethod())(
      <DocumentContext.Provider value={<Page {...props} />}>
        <DocumentComponent />
      </DocumentContext.Provider>,
      pageId,
      compressProps(props),
    );
    return html;
  } catch (err) {
    console.error(err);
    return 'Error';
  } finally {
    if (env === 'production') {
      fs.writeFileSync(path.join(cwd, staticConfig.distDir, `${pageId}.html`), html);
    }
  }
};
