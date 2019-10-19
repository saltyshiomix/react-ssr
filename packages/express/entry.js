import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import Page from './__REACT_SSR_PAGE_NAME__';

const props = JSON.parse('__REACT_SSR_PROPS__');
const html = ReactDOMServer.renderToStaticMarkup(<Page {...props} />);
const withHtml = 0 <= html.indexOf('html');
const ssrSrc = document.getElementById('react-ssr-script').src;
const ssrQuery = '?' + ssrSrc.split('?')[1];
const ssrQueryObject = ssrQuery.substring(1).split('&').map((p) => p.split('=')).reduce((obj, e) => ({...obj, [e[0]]: e[1]}), {});
const ssrId = ssrQueryObject['ssrid'];

switch (ssrId) {
  case 'emotion':
    const { hydrate } = require('emotion');
    const { extractCritical } = require('emotion-server');
    const { ids } = extractCritical(html);
    hydrate(ids);
    break;

  case 'mui':
    // because Material UI uses "useLayoutEffect" so many times, suppress warnings
    console.warn = () => {};

    function MuiApp(props) {
      React.useEffect(() => {
        const jssStyles = document.getElementById('jss-server-side');
        if (jssStyles) {
          jssStyles.parentNode.removeChild(jssStyles);
        }
      }, []);
      return <Page {...props} />;
    }
    if (withHtml) {
      ReactDOM.hydrate(<MuiApp {...props} />, document);
    } else {
      ReactDOM.hydrate(<MuiApp {...props} />, document.getElementById('react-ssr-root'));
    }
    break;

  default:
    if (withHtml) {
      ReactDOM.hydrate(<Page {...props} />, document);
    } else {
      ReactDOM.hydrate(<Page {...props} />, document.getElementById('react-ssr-root'));
    }
    break;
}
