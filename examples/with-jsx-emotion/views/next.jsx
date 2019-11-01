import React from 'react';
import Head from '@react-ssr/express/head';
import {
  Layout,
  BasicCard,
  TitleCard,
  AnimatedCard,
  bounce,
} from '../components';

const Home = (props) => {
  const { title } = props;

  return (
    <Layout>
      <Head>
        <title>{title}</title>
      </Head>
      <TitleCard>
        {title}
      </TitleCard>
      <BasicCard>
        <a href="/">Go to home page</a>
      </BasicCard>
      <AnimatedCard animation={bounce}>
        Let's bounce.
      </AnimatedCard>
    </Layout>
  );
};

export default Home;
