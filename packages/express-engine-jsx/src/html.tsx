import React, { ReactNode } from 'react';

interface HtmlProps {
  children: ReactNode;
  title: string;
  script: string;
}

const Html = (props: HtmlProps) => {
  return (
    <html>
      <head>
        <title>{props.title}</title>
      </head>
      <body>
        <div id="app">{props.children}</div>
        <script src={`/_react-ssr/${props.script}`}></script>
      </body>
    </html>
  );
};

export default Html;
