import React from 'react';

export default ({ script }) => {
  const mountable = typeof window === 'undefined';
  const reloadable = process.env.NODE_ENV !== 'production';

  return (
    <React.Fragment>
      {mountable ? <script id="react-ssr-script" src={script}></script> : null}
      {mountable && reloadable ? <script src="/reload/reload.js"></script> : null}
    </React.Fragment>
  );
};
