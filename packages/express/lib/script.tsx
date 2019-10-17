import React from 'react';

export default ({ script }: { script: string }) => {
  let reloadable = process.env.NODE_ENV !== 'production';
  if (reloadable) {
    if (typeof window !== 'undefined') {
      reloadable = false;
    }
  }

  return (
    <React.Fragment>
      <script src={script}></script>
      {reloadable ? <script src="/reload/reload.js"></script> : null}
    </React.Fragment>
  );
};
