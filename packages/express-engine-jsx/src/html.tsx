import React, { ReactNode } from 'react';

interface HtmlProps {
  children: ReactNode;
  script: string;
}

const Html = (props: HtmlProps) => {
  return (
    <html>
      <body>
        <div id="app">{props.children}</div>
        <script src={`/_react-ssr/${props.script}`}></script>
      </body>
    </html>
  );
};

export default Html;
