import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import ReactHtmlParser from 'react-html-parser';
import cheerio from 'cheerio';
import Page from './__REACT_SSR_PAGE_NAME__';

let renderMethod = ReactDOM.hydrate;
if ('__REACT_SSR_DEVELOPMENT__') {
  renderMethod = ReactDOM.render;
}

const props = JSON.parse('__REACT_SSR_PROPS__');

const html = ReactDOMServer.renderToString(<Page {...props} />);

if (html.indexOf('html') < 0) {
  renderMethod(<Page {...props} />, document.getElementById('app'));
} else {
  const $ = cheerio.load(html);
  const body = $('body').html();


  // debug
  React.Children.forEach(props.children, (child, index) => {
    console.log(child.type);
    console.log(child);
  });


  // const script = '__REACT_SSR_SCRIPT__';
  renderMethod((
    <React.Fragment>
      {/* {ReactHtmlParser(body || '')} */}
      <Page {...props} />
    </React.Fragment>
  ), document.getElementById('app'));
}
