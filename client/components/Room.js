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
    // console.log(userId);
    // this.props.getRoomThunk()
  }
  // static getDerivedStateFromProps(props) {
  //   if (props.room && props.room.id) {
  //     return {
  //       selectedSong: props.playlist.songList[0].audioUrl
  //     };
  //   }
  // }

  render() {
    console.log('PROPS IN ROOM COMPONENT: ', this.props);
    return (
      <Container>
        {!this.props.room.id ? (
          <JoinRoom history={this.props.history} room={this.props.room} />
        ) : (
          <div>
            <div className="roomComponent-roomName">{this.props.room.name}</div>
            <div className="roomComponent-roomKey-header">
              Room Key:{'  '}
              <span className="roomComponent-roomKey-code">
                {this.props.room.roomKey}
              </span>
            </div>

            <br />
            <Playlist />
          </div>
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
