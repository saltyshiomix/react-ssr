import React from 'react';
import ReactDOMServer from 'react-dom/server';
import ReactHtmlParser from 'react-html-parser';
import cheerio from 'cheerio';

interface HtmlProps {
  children: React.ReactNode;
  script: string;
}

const Html = (props: HtmlProps) => {
  const {
    children,
    script,
  } = props;

  const html: string = ReactDOMServer.renderToString(<React.Fragment>{children}</React.Fragment>);

  console.log(html);

  if (html.indexOf('html') < 0) {
    return (
      <html>
        <body>
          <div id="react-ssr-root">
            {children}
          </div>
          <script src={script}></script>
          {process.env.NODE_ENV === 'production' ? null : <script src="/reload/reload.js"></script>}
        </body>
      </html>
    );
  }

  const $ = cheerio.load(html);
  const htmlAttr = $('html').attr();
  const bodyAttr = $('body').attr();
  const head = $('head').html();
  const body = $('body').html();

  return (
    <html {...htmlAttr}>
      <head>
        {ReactHtmlParser(head || '')}
      </head>
      <body {...bodyAttr}>
        <div id="react-ssr-root">
          {ReactHtmlParser(body || '')}
        </div>
        <script src={script}></script>
        {process.env.NODE_ENV === 'production' ? null : <script src="/reload/reload.js"></script>}
      </body>
    </html>
  );
};

export default Html;
