import React, {Component} from 'react';
import {connect} from 'react-redux';

class Room extends Component {
  render() {
    return (
      <div>
        <h1>This is a room that was created</h1>
      </div>
    );
  }
}

export default connect(null, null)(Room);
