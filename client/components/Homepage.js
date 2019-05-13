import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Header, Icon, Image, Container} from 'semantic-ui-react';

class Homepage extends Component {
  render() {
    return (
      <Container text>
        <div className="homepage" id="homepageBackgrouund">
          <div className="homepageText">
            <Header as="h1" icon textAlign="center">
              <Icon name="users" circular />
              <Header.Content id="homePage-h1">Platypus Music</Header.Content>
            </Header>
            <p>
              Platypus is a crowd-sourcing playlist app, that lets everyone be
              the DJ.
            </p>
            <p>
              Create your own room or enter the secret room code to join one
              that is already playing.
            </p>
          </div>
        </div>
      </Container>
    );
  }
}

export default connect(null, null)(Homepage);
