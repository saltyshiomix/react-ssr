import React from 'react';
import ReactDOM from 'react-dom';
import Page from '__REACT_SSR_PAGE__';
import { hasHtml } from '__REACT_SSR_HELPERS__';

const props = JSON.parse('__REACT_SSR_PROPS__');
const container = hasHtml(<Page {...props} />) ? document : document.getElementById('react-ssr-root');

// FIXME: "useLayoutEffect does nothing on the server"
// this may be the bug of `material-ui@~4.5.2`
function MuiApp(props) {
  React.useEffect(() => {
    const jssStyles = document.getElementById('jss-server-side');
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }, []);
  return <Page {...props} />;
}

ReactDOM.hydrate(<MuiApp {...props} />, container);

if (module.hot) {
  module.hot.accept();
}
