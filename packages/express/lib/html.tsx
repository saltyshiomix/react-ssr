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

  const head = $('head').html();
  const body = $('body').html();
  const bodyInnerHTML = $('body').children().html();

  console.log('');
  console.log('BODY');
  console.log(body);
  console.log('');

  console.log('');
  console.log('BODY INNER HTML');
  console.log(bodyInnerHTML);
  console.log('');

  return (
    <html>
      {head
        ? (
          <React.Fragment>
            {ReactHtmlParser(head)}
          </React.Fragment>
        )
        : null}
      <body>
        {ReactHtmlParser(bodyInnerHTML || '')}
        <script src={route + `?props=${injectProps}`}></script>
        {process.env.NODE_ENV === 'production' ? null : <script src="/reload/reload.js"></script>}
      </body>
    </html>
  );
};

export default Html;
