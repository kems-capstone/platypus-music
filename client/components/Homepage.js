import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Header, Card, Container} from 'semantic-ui-react';
// import patty from '../../public/patty.jpeg';

class Homepage extends Component {
  render() {
    return (
      <Container text>
        <div className="homepage" id="homepageBackgrouund">
          <div className="homepageText">
            <Header as="h1" icon textAlign="center">
              <img id="patty" src="/patty.jpeg" />
              <Card.Group itemsPerRow={2}>
                <Card
                  description="Platypus is a crowd-sourcing playlist app, that lets everyone be
              the DJ."
                  color="violet"
                />
                <Card
                  description="Create your own room or enter the secret room code to join one
              that is already playing."
                  color="violet"
                />
              </Card.Group>
            </Header>
          </div>
        </div>
      </Container>
    );
  }
}

export default connect(null, null)(Homepage);
