import fs from 'fs-extra';
import path from 'path';
import React from 'react';
import slash from 'slash';
import LZString from 'lz-string';
import URLSafeBase64 from 'urlsafe-base64';
import App from '../components/App';
import Document from '../components/Document';
import {
  existsSync,
  isProd,
  ssrConfig,
  getEngine,
  getPageId,
} from '../helpers';

require('@babel/register')({
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
  plugins: [
    'babel-plugin-react-require',
    ['babel-plugin-css-modules-transform', {
      'extensions': [
        '.css',
        '.scss',
      ],
    }],
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-class-properties',
    ['@babel/plugin-proposal-object-rest-spread', {
      useBuiltIns: true,
    }],
    '@babel/plugin-transform-react-jsx',
    ['@babel/plugin-transform-runtime', {
      corejs: 3,
      helpers: true,
      regenerator: true,
      useESModules: false,
    }],
    isProd() && [
      'babel-plugin-transform-react-remove-prop-types',
      {
        removeImport: true,
      },
    ],
  ].filter(Boolean),
});

const cwd = process.cwd();
const ext = `.${getEngine()}`;

const DocumentContext = require('./document-context');
const userDocumentPath = path.join(cwd, ssrConfig.viewsDir, `_document${ext}`);
let DocumentComponent: any;
if (existsSync(userDocumentPath)) {
  const UserDocument = require(userDocumentPath);
  DocumentComponent = UserDocument.default || UserDocument;
} else {
  DocumentComponent = Document;
}

const userAppPath = path.join(cwd, ssrConfig.viewsDir, `_app${ext}`);
let AppComponent: any;
if (existsSync(userAppPath)) {
  const UserAppComponent = require(userAppPath);
  AppComponent = UserAppComponent.default || UserAppComponent;
} else {
  AppComponent = App;
}

const getRenderToStringMethod = async () => {
  let method;
  switch (ssrConfig.id) {
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

export default async function render(file: string, props: any): Promise<string> {
  const pageId = getPageId(file, '_');
  const cachePath = path.join(cwd, ssrConfig.distDir, `${pageId}.html`);
  if (isProd() && existsSync(cachePath)) {
    return fs.readFileSync(cachePath).toString();
  }

  let Page = require(file);
  Page = Page.default || Page;

  let html;
  try {
    html = (await getRenderToStringMethod())(
      <DocumentContext.Provider value={<AppComponent children={Page} {...props} />}>
        <DocumentComponent {...props} />
      </DocumentContext.Provider>,
      pageId,
      compressProps(props),
    );
    return html;
  } catch (err) {
    if (!isProd()) {
      console.log(err.stack || err);
    }
    return isProd() ? '' : (err.stack || err);
  } finally {
    if (isProd() && !existsSync(cachePath)) {
      const viewPath = slash(file.replace(path.join(cwd, ssrConfig.viewsDir), '').replace(ext, '')).slice(1);
      if (ssrConfig.staticViews.includes(viewPath)) {
        fs.outputFileSync(cachePath, html);
      }
    }
  }
};
