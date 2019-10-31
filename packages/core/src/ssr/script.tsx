import React from 'react';

export default ({ script }: { script: string }) => {
  const mountable = typeof window === 'undefined';
  return (
    <React.Fragment>
      {mountable ? <script id="react-ssr-script" src={script}></script> : null}
    </React.Fragment>
  );
};
