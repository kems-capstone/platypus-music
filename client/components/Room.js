import React, {Component} from 'react';
import {connect} from 'react-redux';
import {joinRoomThunk, getRoomThunk, closeRoomThunk, refreshRoom, listenForUpdatePlaylistThunk,} from '../store';

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

import socket from '../socket'

class Room extends Component {
  componentDidMount() {
    socket.emit('joinSocketRoom', window.location.pathname)
    const userId = this.props.user.id;
    this.props.fetchRoomPlaylist()
    this.props.refreshRoom()
  }

  render() {

    return (
      <Container>
        {this.props.roomState.room && this.props.roomState.room.id ? (
          <div>
            <Button
              className="right floated mini ui"
              type="button"
              id="close"
              onClick={roomId =>
                this.props.closeRoom(this.props.roomState.room.id)
              }
            >
              Close room
            </Button>
            <div className="roomComponent-roomName">
              {this.props.roomState.room.name}
            </div>
            <div className="roomComponent-roomKey-header">
              Room Key:{'  '}
              <div id="roomComponent-roomKey-code">
                {this.props.roomState.room.roomKey}
              </div>
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
  roomState: state.room,
  user: state.user,
  playlist: state.playlist
});
const mapDispatchToProps = dispatch => {
  return {
    // getRoomThunk: key => dispatch(joinRoomThunk(key))
    // getRoomThunk: userId => dispatch(getRoomThunk(userId)),
    closeRoom: roomId => dispatch(closeRoomThunk(roomId)),
    refreshRoom: () => dispatch(refreshRoom()),
    fetchRoomPlaylist: () => dispatch(listenForUpdatePlaylistThunk()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Room);
