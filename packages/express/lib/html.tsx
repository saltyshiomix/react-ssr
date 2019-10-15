import React from 'react';

interface HtmlProps {
  children: React.ReactNode;
  route: string;
  props: string;
}

const Html = (props: HtmlProps) => {
  return (
    <React.Fragment>
      <div id="app">{props.children}</div>
      <script src={props.route + `?props=${props.props}`}></script>
      {process.env.NODE_ENV === 'production' ? null : <script src="/reload/reload.js"></script>}
    </React.Fragment>
  );
};

export default Html;
