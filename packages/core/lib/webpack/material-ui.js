import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import Page from '__REACT_SSR_PAGE__';

const props = JSON.parse('__REACT_SSR_PROPS__');
const html = ReactDOMServer.renderToString(<Page {...props} />);
const withHtml = 0 <= html.indexOf('html');
const container = withHtml ? document : document.getElementById('react-ssr-root');

function MuiApp(props) {
  // FIXME: it may be the bug of material-ui@4.5.1
  // React.useEffect(() => {
  //   const jssStyles = document.getElementById('jss-server-side');
  //   if (jssStyles) {
  //     jssStyles.parentNode.removeChild(jssStyles);
  //   }
  // }, []);
  return <Page {...props} />;
}

ReactDOM.hydrate(<MuiApp {...props} />, container);

if (module.hot) {
  module.hot.accept();
}
