import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Header, Card, Container, Button} from 'semantic-ui-react';
// import patty from '../../public/patty.jpeg';

class Homepage extends Component {
  render() {
    return (
      <div className='homepage'>
        <img id="patty" src="/patty.jpeg" />
        <div className='homepageBlurb'>
        Platypus is a crowd-sourcing playlist app, that lets everyone be the DJ.
        </div>
        <div className='homepageBlurb'>
        Create your own room or enter the secret room code to join one that is already playing.
        </div>
        <Button as='a' href="/signup" color='violet'>GET STARTED</Button>
      </div>




      // <div className="homepage" id="homepageBackground">
      //   <div className="homepageText">
      //     {/* <Header as="h1" icon textAlign="center"> */}
      //       <img id="patty" src="/patty.jpeg" />
      //       {/* <Card.Group id="cards"> */}

      //         <Card id='homepageCard'
      //           description="Platypus is a crowd-sourcing playlist app, that lets everyone be
      //         the DJ."
      //           color="violet" stacked
      //         />
      //         <Card id='homepageCard'
      //           description="Create your own room or enter the secret room code to join one
      //         that is already playing."
      //           color="violet" stacked
      //         />
      //       {/* </Card.Group> */}
      //     {/* </Header> */}
      //   </div>
      // </div>
    );
  }
}

export default connect(null, null)(Homepage);
