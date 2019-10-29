import ReactSsrScript from '@react-ssr/express/script';

export const Layout = (props) => {
  return (
    <html lang="en">
      <head>
        <title>Default Title</title>
        <meta charSet="utf-8" />
      </head>
      <body>
        {props.children}
        <ReactSsrScript script={props.script} />
      </body>
    </html>
  );
};
