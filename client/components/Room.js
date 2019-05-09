import React, {Component} from 'react';
import {connect} from 'react-redux';
import {authenticateKeyThunk} from '../store/roomReducer';
import {JoinRoom} from '../components'


class Room extends Component {
  componentDidMount() {


  }
  render() {
    console.log('*****this.props: ', this.props);
    return (
      <div>
        {this.props.room.id > 0 ? <h1>{this.props.room.name}</h1> : <JoinRoom /> }

      </div>
    );
  }
}
const mapStateToProps = state => ({
  room: state.room,
  user: state.user,
  playlist: state.playlist
})
const mapDispatchToProps = dispatch => {
  return {
    getRoomThunk: (key) => dispatch(authenticateKeyThunk(key))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Room);
