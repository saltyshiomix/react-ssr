import React from 'react';

const App = (props: React.PropsWithChildren<any>) => {
  const { children, ...rest } = props;
  const PageComponent = children;
  return <PageComponent {...rest} />;
};

export default App;
