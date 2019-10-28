import ReactSsrScript from '@react-ssr/express/script';

export const Layout = (props) => {
  const {
    title,
    children,
    script,
  } = props;

  return (
    <html lang="en">
      <head>
        <title>{title}</title>
        <meta charSet="utf-8" />
      </head>
      <body>
        {children}
        <ReactSsrScript script={script} />
      </body>
    </html>
  );
};
