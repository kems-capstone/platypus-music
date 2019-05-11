import React, {Component} from 'react';
import {connect} from 'react-redux';
import {joinRoomThunk, getRoomThunk} from '../store/roomReducer';

import {JoinRoom, Playlist, Player, SearchForm} from '../components';
import {
  Menu,
  Icon,
  Dropdown,
  Image,
  Button,
  Container,
  Message
} from 'semantic-ui-react';

class Room extends Component {
  componentDidMount() {
    const userId = this.props.user.id;

    this.props.getRoomThunk(userId);
  }

  render() {
    return (
      <Container>
        {this.props.room.roomInfo && this.props.room.roomInfo.rooms[0].id ? (
          <div>
            <div className="roomComponent-roomName">
              {this.props.room.roomInfo.rooms[0].name}
            </div>
            <div className="roomComponent-roomKey-header">
              Room Key:{'  '}
              <span className="roomComponent-roomKey-code">
                {this.props.room.roomInfo.rooms[0].roomKey}
              </span>
              <br />
              <Playlist />
            </div>
          </div>
        ) : (
          ''
        )}
      </Container>
    );
  }
}
const mapStateToProps = state => ({
  room: state.room.room,
  user: state.user,
  playlist: state.playlist
});
const mapDispatchToProps = dispatch => {
  return {
    // getRoomThunk: key => dispatch(joinRoomThunk(key))
    getRoomThunk: userId => dispatch(getRoomThunk(userId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Room);
