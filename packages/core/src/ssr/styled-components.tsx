import React from 'react';
import ReactDOMServer from 'react-dom/server';
import cheerio from 'cheerio';
import ReactHtmlParser from 'react-html-parser';
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

  // const headElement = getHeadElement(children as React.ReactElement);
  // let elements = headElement ? headElement.type.elements : [];

  // // clear the cache, but use the same instance
  // elements.length = 0;

  const sheet = new ServerStyleSheet();
  const html = ReactDOMServer.renderToString(children);
  const withHtml = 0 <= html.toLowerCase().indexOf('html');

  // // these must be called after ReactDOMServer.renderToString()
  // let Title = undefined;
  // let MetaDescription = undefined;
  // if (0 < elements.length) {
  //   Title = createTitleComponent(elements);
  //   MetaDescription = createMetaDescriptionComponent(elements);
  // }

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
          {Title ? <Title /> : ReactHtmlParser($.html($('title')))}
          {MetaDescription ? <MetaDescription /> : ReactHtmlParser($.html($('meta[name=description]')))}
          {ReactHtmlParser(meta)}
          {ReactHtmlParser(styles)}
          {styleElement}
        </head>
        <body {...convertAttrToJsxStyle($('body').attr())}>
          {body ? ReactHtmlParser(body) : null}
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
            {ReactHtmlParser(html)}
          </div>
          <script src={script}></script>
        </body>
      </html>
    );
  }
};
