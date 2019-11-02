import React from 'react';
import ReactDOM from 'react-dom';
import Page from '__REACT_SSR_PAGE__';
import { getCurrentMarkupComponent } from './helpers';

const props = JSON.parse('__REACT_SSR_PROPS__');

function App(props) {
  const [hydrate, setHydrate] = React.useState(false);

  React.useEffect(() => {
    setHydrate(true);

    // const jssStyles = document.getElementById('jss-server-side');
    // if (jssStyles) {
    //   jssStyles.parentNode.removeChild(jssStyles);
    // }
  }, []);

  // wait untill hooks called so that the dynamic `Head` can work correctly
  if (!hydrate) {
    return getCurrentMarkupComponent();
  }

  return <Page {...props} />;
}

ReactDOM.hydrate(<App {...props} />, document.getElementById('react-ssr-root') || document);

if (module.hot) {
  module.hot.accept();
}
