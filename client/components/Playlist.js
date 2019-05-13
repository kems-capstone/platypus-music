import React, {Component} from 'react';
import Player from './Player';
import {connect} from 'react-redux';
import {
  addSongThunk,
  listenForAddPlaylistThunk,
  voteThunk,
  listenForVoteThunk,
  listenForEndSongThunk,
  listenForUpdatePlaylistThunk,
  songPlayed,
  deleteSongThunk
} from '../store/playlist';
import SearchForm from './SearchForm';
import UiSearchForm from './UiSearchForm';
import io from 'socket.io-client';
import {closeRoomThunk} from '../store';

const socket = io(window.location.origin);

class Playlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSong: ''
    };

    this.nextTrack = this.nextTrack.bind(this);
    this.handleSubmitWithProps = this.handleSubmitWithProps.bind(this);
  }

  componentDidMount() {
    console.log('CDM playlist', this.props)
    this.props.addedToPlaylist();
    this.props.listenForVotes();
    this.props.listenForSongEnd();
    this.props.fetchRoomPlaylist();
  }

  static getDerivedStateFromProps(props) {
    if (props.playlist.songList && props.playlist.songList[0]) {
      return {
        selectedSong: props.playlist.songList[0].audioUrl
      };
    } else {
      return '';
    }
  }

  handleSubmitWithProps(event, result, props) {
    result.title = result.title.replace(/\s/g, '');

    try {
      event.preventDefault();


      props.addSong(result.title, this.props.room.room.roomInfo.rooms[0].id);
    } catch (error) {
      console.error(error.message);
    }
  }

  nextTrack() {
    if (this.props.playlist.songList.length >= 1) {
      this.props.songPlayed(
        this.props.playlist.songList[0].id,
        this.props.room.room.roomInfo.rooms[0].id
      );
      socket.emit('endedSong', this.props.playlist.songList);


      this.setState({selectedSong: this.props.playlist.songList[0].audioUrl});
    }
  }

  render() {
    const roomId = this.props.room.room.roomInfo.rooms[0].id;
    console.log('*****this.props.room.host: ', this.props.room.host);
    return (
      <div>
        {this.props.room.host === true ? (
          <div>
            <Player
              selectedSong={this.state.selectedSong}
              nextTrack={this.nextTrack}
            />
            <button
              type="button"
              id="close"
              onClick={roomId =>
                this.props.closeRoom(this.props.room.room.roomInfo.rooms[0].id)
              }
            >
              Close this room
            </button>
          </div>
        ) : (
          <div>
            <h4>Something can go here later</h4>
          </div>
        )}

        <UiSearchForm handleSubmitWithProps={this.handleSubmitWithProps} />

        <div>
          {this.props.playlist.songList.map(index => {
            return (
              <div key={index.id}>
                <h4>{index.name}</h4>
                <h1>{index.voteCount}</h1>
                {this.props.playlist.songList[0].id !== index.id && (
                  <div>
                    <button
                      type="button"
                      onClick={() =>
                        this.props.updateVote(
                          this.props.room.room.roomInfo.rooms[0].id,
                          index.id,
                          {
                            upVote: 'upVote'
                          }
                        )
                      }
                    >
                      upvote
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        this.props.updateVote(
                          this.props.room.room.roomInfo.rooms[0].id,
                          index.id,
                          {
                            downVote: 'downVote'
                          }
                        )
                      }
                    >
                      downvote
                    </button>{' '}
                  </div>
                )}
                {this.props.room.host.id &&
                  this.props.room.host.id === this.props.user.id && (
                    <button
                      type="button"
                      onClick={(songId, roomId) =>
                        this.props.deleteSong(
                          index.id,
                          this.props.room.room.roomInfo.rooms[0].id
                        )
                      }
                    >
                      Delete song
                    </button>
                  )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  playlist: state.playlist,
  form: state.form,
  room: state.room,
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  addSong: (song, room) => dispatch(addSongThunk(song, room)),
  addedToPlaylist: () => dispatch(listenForAddPlaylistThunk()),
  updateVote: (room, song, voteValue) =>
    dispatch(voteThunk(room, song, voteValue)),

  listenForVotes: () => dispatch(listenForVoteThunk()),
  listenForSongEnd: () => dispatch(listenForEndSongThunk()),
  fetchRoomPlaylist: () => dispatch(listenForUpdatePlaylistThunk()),
  closeRoom: roomId => dispatch(closeRoomThunk(roomId)),
  songPlayed: (songid, roomid) => dispatch(songPlayed(songid, roomid)),
  deleteSong: (songId, roomId) => dispatch(deleteSongThunk(songId, roomId))
});

export default connect(mapStateToProps, mapDispatchToProps)(Playlist);
