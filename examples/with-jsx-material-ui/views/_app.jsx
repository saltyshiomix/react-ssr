import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { theme } from '../lib/theme';

const App = (props) => {
  const { children, ...rest } = props;
  const PageComponent = children;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PageComponent {...rest} />
    </ThemeProvider>
  );
};

export default App;
