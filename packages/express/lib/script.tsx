import React from 'react';

export default ({ script }: { script: string }) => {
  let reloadable = process.env.NODE_ENV !== 'production';
  if (reloadable) {
    reloadable = !document.getElementById('reload');
  }

  return (
    <React.Fragment>
      <script src={script}></script>
      {reloadable ? <script id="reload" src="/reload/reload.js"></script> : null}
    </React.Fragment>
  );
};
