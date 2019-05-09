import React, {Component} from 'react';
import {connect} from 'react-redux';
import {authenticateKeyThunk} from '../store/roomReducer';

import {JoinRoom, Playlist, Player, SearchForm} from '../components';
import {Menu, Icon, Dropdown, Image, Button, Container, Message} from 'semantic-ui-react';


class Room extends Component {
  componentDidMount() {}
  render() {

    return (
      <Container>
        {!this.props.room.id > 0 ? (
          <JoinRoom />
        ) : (
          <div>
            <div className='roomComponent-roomName'>{this.props.room.name}</div>
            <div className='roomComponent-roomKey-header'>Room Key:{"  "}
            <span className='roomComponent-roomKey-code'>

            {this.props.room.roomKey}
            </span>

            </div>

            <br/>
            <Playlist />


          </div>
        )}

      </Container>

    );
  }
}
const mapStateToProps = state => ({
  room: state.room,
  user: state.user,
  playlist: state.playlist
});
const mapDispatchToProps = dispatch => {
  return {

    getRoomThunk: key => dispatch(authenticateKeyThunk(key))

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Room);
