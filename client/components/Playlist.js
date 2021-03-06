import React, {Component} from 'react';
import Player from './Player';
import {connect} from 'react-redux';
import {
  addSongThunk,
  listenForAddPlaylistThunk,
  voteThunk,
  listenForVoteThunk,
  listenForEndSongThunk,
  songPlayed,
  deleteSongThunk
} from '../store/playlist';
import {refreshRoom} from '../store/roomReducer';

import UiSearchForm from './UiSearchForm';
import io from 'socket.io-client';
import {closeRoomThunk} from '../store';
import {Button, Divider} from 'semantic-ui-react';

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
    socket.emit('joinSocketRoom', window.location.pathname);
    this.props.addedToPlaylist();
    this.props.listenForVotes();
    this.props.listenForSongEnd();

    this.props.refreshRoom();
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
    try {
      event.preventDefault();

      props.addSong(result.title, this.props.roomState.room.id);
    } catch (error) {
      console.error(error.message);
    }
  }

  nextTrack() {
    if (this.props.playlist.songList.length >= 1) {
      this.props.songPlayed(
        this.props.playlist.songList[0].id,
        this.props.roomState.room.id
      );
      socket.emit('endedSong', this.props.playlist.songList);

      this.setState({selectedSong: this.props.playlist.songList[0].audioUrl});
    }
  }

  render() {

      let currentSong = this.props.playlist.songList[0] || {};
      let queuedSongs = this.props.playlist.songList.slice(1) || [];



    return (
      <div id="playlist-info">
        {this.props.roomState.host === true ? (
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
          <Divider horizontal color="purple">
            Currently Playing
          </Divider>

          <div className="card " id="currentSongCard" key={currentSong.id}>
            <div className="contentCard " id="currentSongContent">
              <img
               id="playingSongImage"
                src={currentSong.artworkUrl}
              />
              {/* <div
                id="vote-number"
                className="vote-count right floated mini ui image"
              >
                {currentSong.voteCount}
              </div> */}
              <div className="center aligned header">{currentSong.name}</div>
              <div className="center aligned description" id="artist">
                {currentSong.artist}
              </div>
            </div>
          </div>
          <Divider horizontal color="red">
            Next Up
          </Divider>
          {queuedSongs.map(song => {
            return (
              <div className="card" key={song.id}>
                <div className="contentCard">
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

                <div className="extra content">
                  <div className="ui two buttons">
                    <button
                      className="ui basic green button"
                      type="button"
                      onClick={() =>
                        this.props.updateVote(
                          this.props.roomState.room.id,
                          song,
                          'upvote'
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
                          this.props.roomState.room.id,
                          song,
                          'downvote'
                        )
                      }
                    >
                      <i className="thumbs down icon" />
                    </button>{' '}
                  </div>
                </div>

                {this.props.roomState.host && (
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

  closeRoom: roomId => dispatch(closeRoomThunk(roomId)),
  songPlayed: (songid, roomid) => dispatch(songPlayed(songid, roomid)),
  deleteSong: (songId, roomId) => dispatch(deleteSongThunk(songId, roomId)),
  refreshRoom: () => dispatch(refreshRoom())
});

export default connect(mapStateToProps, mapDispatchToProps)(Playlist);
