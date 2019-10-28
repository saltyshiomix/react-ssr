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
  const {
    title,
    script, // injected by @react-ssr/express
  } = props;

  return (
    <Layout
      script={script} // pass it for dynamic SSR
    >
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
