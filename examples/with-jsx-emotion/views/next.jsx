import React from 'react';
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
      title={title}
      script={script} // pass it for dynamic SSR
    >
      <div>
        <TitleCard>
          {title}
        </TitleCard>
        <BasicCard>
          <a href="/">Go to home page</a>
        </BasicCard>
        <AnimatedCard animation={bounce}>
          Let's bounce.
        </AnimatedCard>
      </div>
    </Layout>
  );
};

export default Home;
