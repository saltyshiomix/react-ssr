export const Layout = (props) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body>
        {props.children}
      </body>
    </html>
  );
};
