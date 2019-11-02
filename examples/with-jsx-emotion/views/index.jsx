import React from 'react';
import Head from '@react-ssr/express/head';
import {
  Layout,
  BasicCard,
  TitleCard,
  HoverableCard,
} from '../components';

const Home = (props) => {
  const { title } = props;

  const [message, setMessage] = React.useState('With :hover.');

  const onMouseEnter = () => setMessage('This is a react-ssr!');
  const onMouseLeave = () => setMessage('With :hover.');

  return (
    <Layout>
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
    </Layout>
  );
};

export default Home;
