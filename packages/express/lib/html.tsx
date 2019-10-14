import React from 'react';

interface HtmlProps {
  children: React.ReactNode;
  route: string;
  props: string;
}

const Html = (props: HtmlProps) => {
  return (
    <html>
      <body>
        <div id="app">{props.children}</div>
        <script src={props.route + `?props=${props.props}`}></script>
      </body>
    </html>
  );
};

export default Html;
