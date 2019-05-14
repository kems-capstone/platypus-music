import React, {Component} from 'react';
import {connect} from 'react-redux';
import {joinRoomThunk, getRoomThunk} from '../store';

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
        {this.props.roomState.room && this.props.roomState.room.id ? (
          <div>
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
    getRoomThunk: userId => dispatch(getRoomThunk(userId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Room);
