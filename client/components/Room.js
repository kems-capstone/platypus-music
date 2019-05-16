import React, {Component} from 'react';
import {connect} from 'react-redux';
import history from '../history'
import {
  joinRoomThunk,
  getRoomThunk,
  closeRoomThunk,
  refreshRoom,
  listenForUpdatePlaylistThunk
} from '../store';

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

import socket from '../socket';

class Room extends Component {
  constructor(props){
    super(props)

    // this.leaveRoom = this.leaveRoom.bind(this)
    // this.showSocketRooms = this.showSocketRooms.bind(this)
  }
  componentDidMount() {
    socket.emit('joinSocketRoom', window.location.pathname);
    socket.on('partyEnded', function(){
      history.push('/dashboard')
    })
    this.props.fetchRoomPlaylist();
    this.props.refreshRoom();
  }
  // showSocketRooms(){
  //   socket.emit('showRoom')
  // }
  // leaveRoom(){
  //   console.log('*****: leaving socket room front', socket.rooms);
  //   socket.emit('leaveSocketRoom', socket.rooms)
  // }

  render() {
    console.log(this.props)
    return (
      <div>
{/*
        <button type='button' onClick={this.leaveRoom}>Leave Socket Room</button>
      <button type='button' onClick={this.showSocketRooms}>Show Socket Room</button> */}
        {this.props.roomState.room && this.props.roomState.room.id ? (
          <div>
            {this.props.roomState.host === true &&
            <Button
              className="right floated mini ui"
              type="button"
              id="close"
              onClick={roomId =>
                this.props.closeRoom(this.props.roomState.room.id)
              }
            >
              Close room
            </Button>}
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
      </div>
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
    fetchRoomPlaylist: () => dispatch(listenForUpdatePlaylistThunk())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Room);
