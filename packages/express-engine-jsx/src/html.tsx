import React, { ReactNode } from 'react';

interface HtmlProps {
  children: ReactNode;
  title: string;
  scriptName: string;
}

const Html = (props: HtmlProps) => {
  return (
    <html>
      <head>
        <title>{props.title}</title>
      </head>
      <body>
        <div id="app">{props.children}</div>
        <script src={`/_react-ssr/${props.scriptName}`}></script>
      </body>
    </html>
  );
};

export default Html;
