import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
  Typography,
  Button,
} from '@material-ui/core';
import { Layout } from '../components/Layout';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      paddingTop: theme.spacing(4),
    },
    logo: {
      width: 240,
      margin: theme.spacing(2),
    },
  })
);

const Index = (props) => {
  const classes = useStyles({});
  const [message, setMessage] = React.useState(props.user.name);

  const onClick = () => setMessage('@react-ssr/express');

  return (
    <Layout>
      <div className={classes.root}>
        <Typography variant="h4" gutterBottom>
          Material UI
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          with @react-ssr/express
        </Typography>
        <img
          className={classes.logo}
          src="/images/logo.svg"
        />
        <br />
        <Button
          variant="contained"
          color="primary"
          onClick={onClick}
        >
          CLICK ME
        </Button>
        <br />
        <br />
        <Typography gutterBottom>
          Hello {message}!
        </Typography>
      </div>
    </Layout>
  );
};

export default Index;
