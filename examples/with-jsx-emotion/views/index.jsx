import React from 'react';
import { Head } from '@react-ssr/express';
import {
  BasicCard,
  TitleCard,
  HoverableCard,
} from '../components';

const HomePage = (props) => {
  const { title } = props;

  const [message, setMessage] = React.useState('With :hover.');

  const onMouseEnter = () => setMessage('This is a react-ssr!');
  const onMouseLeave = () => setMessage('With :hover.');

  return (
    <React.Fragment>
      <Head>
        <title>{title}</title>
      </Head>
      <TitleCard>
        {title}
      </TitleCard>
      <BasicCard>
        <a href="/next">Go to next page</a>
      </BasicCard>
      <HoverableCard onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        {message}
      </HoverableCard>
    </React.Fragment>
  );
};

export default HomePage;
