import React from 'react';
import Head from '@react-ssr/express/head';

const Post = ({ post }) => {
  return (
    <React.Fragment>
      <Head>
        <title>{post.body} - basic-blogging</title>
      </Head>
      <p>{post.body}</p>
    </React.Fragment>
  );
};

export default Post;
