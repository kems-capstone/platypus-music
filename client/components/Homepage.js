import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Header, Card, Container, Button} from 'semantic-ui-react';

import PropTypes from 'prop-types';

class Homepage extends Component {
  render() {
    return (
      <div className="homepage">
        <img id="patty" src="/patty.jpeg" />
        <div className="homepageBlurb">
          Platypus is a crowd-sourcing playlist app, that lets everyone be the
          DJ.
        </div>
        <div className="homepageBlurb">
          Create your own room or enter the secret room code to join one that is
          already playing.
        </div>
        {!this.props.user.id && (
          <Button as="a" href="/signup" color="violet">
            GET STARTED
          </Button>
        )}
      </div>
    );
  }
}

const mapState = state => {
  return {
    user: state.user
  };
};

export default connect(mapState)(Homepage);
