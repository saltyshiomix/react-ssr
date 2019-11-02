import React from 'react';
import ReactDOMServer from 'react-dom/server';
import cheerio from 'cheerio';
import parse from 'html-react-parser';
import {
  extractHeadElements,
  convertAttrToJsxStyle,
} from '../helpers/head';
import { SsrProps } from './interfaces';

const { ServerStyleSheet, StyleSheetManager } = require('styled-components');

export default function Ssr(props: SsrProps) {
  const {
    children,
    script,
  } = props;

  const {
    Title,
    MetaDescription,
  } = extractHeadElements(children);

  const sheet = new ServerStyleSheet();
  const html = ReactDOMServer.renderToString(children);
  const withHtml = 0 <= html.toLowerCase().indexOf('html');

  if (withHtml) {
    let html;
    let styleElement;
    try {
      html = ReactDOMServer.renderToString(
        <StyleSheetManager sheet={sheet.instance}>
          {children}
        </StyleSheetManager>
      );
      styleElement = sheet.getStyleElement();
    } catch (error) {
      console.error(error);
      return <html><body>{error}</body></html>;
    } finally {
      sheet.seal();
    }
    const $ = cheerio.load(html);
    const meta = $.html($('head meta').filter((i, el) => $(el).attr('name') !== 'description'));
    const styles = $.html($('head style'));
    const body = $('body').html();
    return (
      <html {...convertAttrToJsxStyle($('html').attr())}>
        <head>
          {Title ? <Title /> : parse($.html($('title')))}
          {MetaDescription ? <MetaDescription /> : parse($.html($('meta[name=description]')))}
          {parse(meta)}
          {parse(styles)}
          {styleElement}
        </head>
        <body {...convertAttrToJsxStyle($('body').attr())}>
          {body ? parse(body) : null}
          <script src={script}></script>
        </body>
      </html>
    );
  } else {
    let html;
    let styleElement;
    try {
      html = ReactDOMServer.renderToString(
        <StyleSheetManager sheet={sheet.instance}>
          {children}
        </StyleSheetManager>
      );
      styleElement = sheet.getStyleElement();
    } catch (error) {
      console.error(error);
      return <html><body>{error}</body></html>;
    } finally {
      sheet.seal();
    }
    return (
      <html>
        <head>
          {Title && <Title />}
          {MetaDescription && <MetaDescription />}
          {styleElement}
        </head>
        <body>
          <div id="react-ssr-root">
            {parse(html)}
          </div>
          <script src={script}></script>
        </body>
      </html>
    );
  }
};
