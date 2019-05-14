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
import {Button} from 'semantic-ui-react';

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
    return (
      <div id="playlist-info">
        {this.props.roomState.room.host === true ? (
          <div>
            <Player
              selectedSong={this.state.selectedSong}
              nextTrack={this.nextTrack}
            />
          </div>
        ) : (
          <div>
            <h4>Something can go here later</h4>
          </div>
        )}

        <UiSearchForm handleSubmitWithProps={this.handleSubmitWithProps} />

        <div id="playlist-info" className="ui cards">
          {this.props.playlist.songList.map(song => {
            return (
              <div className="card" key={song.id}>
                <div className="content">
                  <img
                    className="left floated mini ui image"
                    src={song.artworkUrl}
                  />
                  <div
                    id="vote-number"
                    className="vote-count right floated mini ui image"
                  >
                    {song.voteCount}
                  </div>
                  <div className="header">{song.name}</div>
                  <div id="artist">{song.artist}</div>
                </div>
                {this.props.playlist.songList[0].id !== song.id && (
                  <div className="extra content">
                    <div className="ui two buttons">
                      <button
                        className="ui basic green button"
                        type="button"
                        onClick={() =>
                          this.props.updateVote(
                            this.props.roomState.room.id,
                            song.id,
                            {
                              upVote: 'upVote'
                            }
                          )
                        }
                      >
                        <i className="thumbs up icon" />
                      </button>
                      <button
                        className="ui basic orange button"
                        type="button"
                        onClick={() =>
                          this.props.updateVote(
                            this.props.room.room.roomInfo.rooms[0].id,
                            song.id,
                            {
                              downVote: 'downVote'
                            }
                          )
                        }
                      >
                        <i className="thumbs down icon" />
                      </button>{' '}
                    </div>
                  </div>
                )}
                {this.props.roomState.host (
                    <button
                      type="button"
                      onClick={(songId, roomId) =>
                        this.props.deleteSong(
                          song.id,
                          this.props.roomState.room.id
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
  roomState: state.room,
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
