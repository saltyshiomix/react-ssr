import React, { useState } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
  Typography,
  Button,
} from '@material-ui/core';
import { Layout } from '../components';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      paddingTop: theme.spacing(4),
    },
  })
);

const Index = ({ user }) => {
  const {
    user,
    script, // injected by @react-ssr/express
  } = props;

  const classes = useStyles({});
  const [message, setMessage] = useState(user.name);

  const onClick = () => setMessage('@react-ssr/express');

  return (
    <Layout
      title="with-jsx-material-ui - @react-ssr/express"
      script={script} // pass it for dynamic SSR
    >
      <div className={classes.root}>
        <Typography variant="h4" gutterBottom>
          Material UI
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          with @react-ssr/express
        </Typography>
        <img src="/static/logo.png" />
        <Button
          variant="contained"
          color="primary"
          onClick={onClick}
        >
          CLICK ME
        </Button>
        <Typography gutterBottom>
          Hello {message}!
        </Typography>
      </div>
    </Layout>
  );
};

export default Index;
