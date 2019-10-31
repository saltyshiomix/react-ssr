import React from 'react';

export default ({ script }: { script: string }) => {
  return (
    <React.Fragment>
      {typeof window === 'undefined' ? <script id="react-ssr-script" src={script}></script> : null}
    </React.Fragment>
  );
};
