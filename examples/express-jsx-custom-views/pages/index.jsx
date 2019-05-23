import React from 'react';
import { Helmet } from 'react-helmet';

export default class extends React.Component {
  state = {
    message: 'This message is from state!',
  };

  handleClick = () => {
    alert(this.state.message);
  };

  render() {
    return (
      <React.Fragment>
        <Helmet>
          <meta charSet="utf-8" />
          <title>The example of "express-jsx-custom-views"</title>
        </Helmet>
        <div>
          <p>Hello {this.props.user.name}!</p>
          <button onClick={this.handleClick}>Click Me</button>
        </div>
      </React.Fragment>
    );
  }
}
