import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import cheerio from 'cheerio';
import Page from './__REACT_SSR_PAGE_NAME__';

let renderMethod = ReactDOM.hydrate;
if ('__REACT_SSR_DEVELOPMENT__') {
  renderMethod = ReactDOM.render;
}

const props = JSON.parse('__REACT_SSR_PROPS__');

const html = ReactDOMServer.renderToStaticMarkup(<Page {...props} />);

if (html.indexOf('html') < 0) {
  renderMethod(<Page {...props} />, document.getElementById('app'));
} else {
  const $ = cheerio.load(html);
  const body = $('body').html();

  // const script = '__REACT_SSR_SCRIPT__';
  // renderMethod((
  //   <React.Fragment>
  //     {/* {ReactHtmlParser(body || '')} */}
  //     <Page {...props} />
  //   </React.Fragment>
  // ), document.getElementById('app').contentDocument);

  const iframe = document.getElementById('app');
  iframe.contentDocument.innerHTML = '';

  renderMethod(<Page {...props} />, document.getElementById('app').contentDocument);
}
