import React, {Component} from 'react';
import {connect} from 'react-redux';
import {getRoomThunk} from '../store/roomReducer';

class Room extends Component {
  componentDidMount() {}
  render() {
    return (
      <div>
        <h1>This is a room that was created</h1>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getRoomThunk: () => dispatch(getRoomThunk())
  };
};

export default connect(null, mapDispatchToProps)(Room);
