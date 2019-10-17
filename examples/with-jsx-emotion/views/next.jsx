import React from 'react';
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
    <Layout title={title}>
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
