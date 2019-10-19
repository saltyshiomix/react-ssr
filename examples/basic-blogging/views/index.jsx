const Index = ({ posts }) => {
  return (
    <React.Fragment>
      {posts.map((post, index) => {
        return (
          <p key={index}>
            <a href={'/posts/' + post.id}>{post.body}</a>
          </p>
        );
      })}
    </React.Fragment>
  );
};

export default Index;
