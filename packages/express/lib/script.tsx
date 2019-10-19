import React from 'react';

export default ({ script }: { script: string }) => {
  const mountable = typeof window === 'undefined';
  const reloadable = process.env.NODE_ENV !== 'production';
  const YellowBox = require('yellowbox-react');

  return (
    <React.Fragment>
      {mountable ? <script id="react-ssr-script" src={script}></script> : null}
      {mountable && reloadable ? <script src="/reload/reload.js"></script> : null}
      {mountable && reloadable ? <YellowBox /> : null}
    </React.Fragment>
  );
};
