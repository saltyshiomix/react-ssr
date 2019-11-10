import React from 'react';
import ReactDOM from 'react-dom';
import Page from '__REACT_SSR_PAGE__';

const props = JSON.parse('__REACT_SSR_PROPS__');

function App(props) {
  React.useEffect(() => {
    const jssStyles = document.getElementById('jss-server-side');
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }, []);
  return <Page {...props} />;
}

ReactDOM.hydrate(<App {...props} />, document.getElementById('react-ssr-root'));

if (module.hot) {
  module.hot.accept();
}
