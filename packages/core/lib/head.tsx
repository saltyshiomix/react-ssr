import React from 'react';

export default ({ children }: { children?: React.ReactNode }) => {
  return (
    <head>
      {children}
    </head>
  );
};
