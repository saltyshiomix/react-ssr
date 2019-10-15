import React from 'react';
import ReactDOMServer from 'react-dom/server';
import ReactHtmlParser from 'react-html-parser';
import cheerio from 'cheerio';

interface HtmlProps {
  children: React.ReactNode;
  route: string;
  injectProps: string;
}

const Html = (props: HtmlProps) => {
  const {
    children,
    route,
    injectProps,
  } = props;

  const html: string = ReactDOMServer.renderToStaticMarkup(<React.Fragment>{children}</React.Fragment>);

  if (html.indexOf('html') < 0) {
    return (
      <html>
        <body>
          <div id="app">{children}</div>
          <script src={route + `?props=${injectProps}`}></script>
          {process.env.NODE_ENV === 'production' ? null : <script src="/reload/reload.js"></script>}
        </body>
      </html>
    );
  }

  console.log('');
  console.log('HTML');
  console.log(html);
  console.log('');

  const $ = cheerio.load(html);

  const htmlAttr = $('html').attr();
  console.log('');
  console.log('htmlAttr');
  console.log(htmlAttr);
  console.log('');

  const head = $('head').html();
  const body = $('body').html();

  console.log('');
  console.log('HEAD');
  console.log(head);
  console.log('');

  console.log('');
  console.log('BODY');
  console.log(body);
  console.log('');

  return (
    <html>
      <head>
        {ReactHtmlParser(head || '')}
      </head>
      <body>
        {ReactHtmlParser(body || '')}
        <script src={route + `?props=${injectProps}`}></script>
        {process.env.NODE_ENV === 'production' ? null : <script src="/reload/reload.js"></script>}
      </body>
    </html>
  );
};

export default Html;
