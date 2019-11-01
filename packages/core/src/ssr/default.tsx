import React from 'react';
import ReactDOMServer from 'react-dom/server';
import ReactHtmlParser, { convertNodeToElement } from 'react-html-parser';
import cheerio from 'cheerio';
import {
  extractHeadElements,
  convertAttrToJsxStyle,
} from '../helpers/head';
import { SsrProps } from './interfaces';

export default function Ssr(props: SsrProps) {
  const {
    children,
    script,
  } = props;

  const {
    Title,
    MetaDescription,
  } = extractHeadElements(children);

  const html = ReactDOMServer.renderToString(children);
  const withHtml = 0 <= html.toLowerCase().indexOf('html');

  if (withHtml) {
    const $ = cheerio.load(html);
    const meta = $.html($('head meta').filter((i, el) => $(el).attr('name') !== 'description'));
    const styles = $.html($('head style'));
    const body = $('body').html();

    return (
      <html {...convertAttrToJsxStyle($('html').attr())}>
        <head>
          {Title ? <Title /> : ReactHtmlParser($.html($('title')), { transform: (node, index, transform: any) => {
            node.attribs!['suppressHydrationWarning'] = 'suppressHydrationWarning';
            return convertNodeToElement(node, index, transform);
          } })}
          {MetaDescription ? <MetaDescription /> : ReactHtmlParser($.html($('meta[name=description]')))}
          {ReactHtmlParser(meta)}
          {ReactHtmlParser(styles)}
        </head>
        <body {...convertAttrToJsxStyle($('body').attr())}>
          {body ? ReactHtmlParser(body) : null}
          <script src={script}></script>
        </body>
      </html>
    );
  } else {
    return (
      <html>
        <head>
          {Title && <Title />}
          {MetaDescription && <MetaDescription />}
        </head>
        <body>
          <div id="react-ssr-root">
            {children}
          </div>
          <script src={script}></script>
        </body>
      </html>
    );
  }
};
