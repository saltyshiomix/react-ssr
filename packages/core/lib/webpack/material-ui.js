import React from 'react';
import ReactDOM from 'react-dom';
import Page from '__REACT_SSR_PAGE__';

const props = JSON.parse('__REACT_SSR_PROPS__');

const root = document.getElementById('react-ssr-root');
const markup = root ? root.innerHTML : document.documentElement.outerHTML;
const container = root || document;

function App(props) {
  const [hydrate, setHydrate] = React.useState(false);

  React.useEffect(() => {
    setHydrate(true);

    const jssStyles = document.getElementById('jss-server-side');
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }, []);

  // wait untill hooks called so that dynamic `Head` can work correctly
  if (!hydrate) {
    return ReactHtmlParser(markup);
  }

  return <Page {...props} />;
}

ReactDOM.hydrate(<App {...props} />, container);

if (module.hot) {
  module.hot.accept();
}
