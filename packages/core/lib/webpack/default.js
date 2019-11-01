import React from 'react';
import ReactDOM from 'react-dom';
// import ReactDOMServer from 'react-dom/server';
// import PageEnhancer from './enhancer';
import Page from '__REACT_SSR_PAGE__';
import ReactHtmlParser from 'react-html-parser';
import cheerio from 'cheerio';

const props = JSON.parse('__REACT_SSR_PROPS__');
// const html = ReactDOMServer.renderToStaticMarkup(<Page {...props} />);
// const withHtml = 0 <= html.indexOf('html');
// const container = withHtml ? document : document.getElementById('react-ssr-root');

const convertAttrToJsxStyle = attr => {
  const jsxAttr = {};
  const keys = Object.keys(attr);
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    if (key === 'class') {
      key = 'className';
    }
    if (0 <= key.indexOf('-')) {
      if (!key.startsWith('data-')) {
        key = key.replace(/-([a-z])/g, g => g[1].toUpperCase());
      }
    }
    jsxAttr[key] = attr[keys[i]];
  }
  return jsxAttr;
}

let _headElement = undefined;

const getHeadElement = child => {
  if (typeof child === 'string' || child.type === 'script') {
    return undefined;
  }
  if (typeof child.type === 'function') {
    if (child.type.name.toLowerCase() === 'script') {
      return undefined;
    }
    if (child.type.name.toLowerCase() === 'head') {
      return child;
    }
    return getHeadElement(child.type(child.props));
  }
  React.Children.forEach(child.props.children, child => {
    if (_headElement) {
      return;
    }
    const __headElement = getHeadElement(child);
    if (__headElement) {
      _headElement = __headElement;
      return;
    }
    if (typeof child.type === 'function' && child.type.name.toLowerCase() === 'head') {
      _headElement = child;
      return;
    }
  });
  return _headElement;
};

const extractHeadElements = element => {
  const headElement = getHeadElement(element);
  if (!headElement.props.children) {
    return {
      Title: undefined,
      MetaDescription: undefined,
    };
  }
  let Title = undefined;
  let MetaDescription = undefined;
  React.Children.forEach(headElement.props.children, child => {
    if (child.type === 'title') {
      Title = props => React.cloneElement(child, props);
    }
    if (child.type === 'meta' && child.props.name === 'description') {
      MetaDescription = props => React.cloneElement(child, props);
    }
  });
  return {
    Title,
    MetaDescription,
  }
};

const EnhancePage = element => props => {
  const {
    Title,
    MetaDescription,
  } = extractHeadElements(element);

  const html = ReactDOMServer.renderToString(<Page {...props} />);
  const withHtml = 0 <= html.indexOf('html');
  const container = withHtml ? document : document.getElementById('react-ssr-root');

  if (withHtml) {
    const $ = cheerio.load(html);
    const meta = $.html($('head meta').filter((i, el) => $(el).attr('name') !== 'description'));
    const styles = $.html($('head style'));
    const body = $('body').html();
    return [
      container,
      (
        <html {...convertAttrToJsxStyle($('html').attr())}>
          <head>
            {Title ? <Title /> : ReactHtmlParser($.html($('title')))}
            {MetaDescription ? <MetaDescription /> : ReactHtmlParser($.html($('meta[name=description]')))}
            {ReactHtmlParser(meta)}
            {ReactHtmlParser(styles)}
          </head>
          <body {...convertAttrToJsxStyle($('body').attr())}>
            {body ? ReactHtmlParser(body) : null}
            {/* <script src={script}></script> */}
          </body>
        </html>
      ),
    ];
  } else {
    return [
      container,
      (
        <html>
          <head>
            {Title && <Title />}
            {MetaDescription && <MetaDescription />}
          </head>
          <body>
            <div id="react-ssr-root">
              {element}
            </div>
            {/* <script src={script}></script> */}
          </body>
        </html>
      ),
    ];
  }
};

const [container, EnhancedPage] = EnhancePage(Page)(props);

ReactDOM.hydrate(<EnhancedPage />, container);

if (module.hot) {
  module.hot.accept();
}
