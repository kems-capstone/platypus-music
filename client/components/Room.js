import React, {Component} from 'react';
import {connect} from 'react-redux';
import {authenticateKeyThunk} from '../store/roomReducer';
import {JoinRoom} from '../components'

class Room extends Component {
  componentDidMount() {
    authenticateKeyThunk()

  }
  render() {
    return (
      <div>
        <JoinRoom />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getRoomThunk: (key) => dispatch(authenticateKeyThunk(key))
  };
};

export default connect(null, mapDispatchToProps)(Room);
