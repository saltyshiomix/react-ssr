import React from 'react';

export default (props) => {
  return (
    <React.Fragment>
      {props.children}
      <script src={props.script}></script>
      {process.env.NODE_ENV === 'production' ? null : <script src="/reload/reload.js"></script>}
    </React.Fragment>
  );
};
