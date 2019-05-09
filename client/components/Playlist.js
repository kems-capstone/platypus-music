import React, {Component} from 'react';
import Player from './Player';
import {connect} from 'react-redux';
import {addSongThunk, listenForDataThunk, voteThunk} from '../store/playlist';
import SearchForm from './SearchForm';
import io from 'socket.io-client';

const socket = io(window.location.origin);

class Playlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSong: ''
    };

    this.nextTrack = this.nextTrack.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.updateStore();
  }

  static getDerivedStateFromProps(props) {
    if (props.playlist.songList && props.playlist.songList[0]) {
      return {
        selectedSong: props.playlist.songList[0].audioUrl
      };
    }
  }

  handleSubmit(event) {
    try {
      event.preventDefault();
      this.props.addSong(
        this.props.form.search.values.trackSearch,
        this.props.room.id
      );
    } catch (error) {
      console.error(error.message);
    }
  }

  nextTrack() {
    if (this.props.playlist.songList.length >= 1) {
      this.props.playlist.songList.shift();
      socket.emit('updateRoom', this.props.playlist.songList);
      this.setState({selectedSong: this.props.playlist.songList[0].audioUrl});
    }
  }

  render() {
    console.log('PROPS IN PLAYLIST COMPONENT: ', this.props);
    return (
      <div>
        <Player
          selectedSong={this.state.selectedSong}
          handleSubmit={this.handleSubmit}
          nextTrack={this.nextTrack}
        />
        {/* PUT THIS BACK IN WHEN WE FIX FETCH METHOD */}
        {/* {this.props.room.hostId === this.props.user.id ? (
          <Player
            selectedSong={this.state.selectedSong}
            handleSubmit={this.handleSubmit}
            nextTrack={this.nextTrack}
          />
        ) : (
          <div>
            <audio
              autoPlay={true}
              onEnded={this.nextTrack}
              src={this.state.selectedSong}
              id="audioPlayer-guest"
            />
          </div>
        )} */}

        <SearchForm handleSubmit={this.handleSubmit} />

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
                        this.props.updateVote(this.props.room.id, index.id, {
                          upVote: 'upVote'
                        })
                      }
                    >
                      upvote
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        this.props.updateVote(this.props.room.id, index.id, {
                          downVote: 'downVote'
                        })
                      }
                    >
                      downvote
                    </button>{' '}
                  </div>
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
  room: state.room.room,
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  addSong: (song, room) => dispatch(addSongThunk(song, room)),
  updateStore: () => dispatch(listenForDataThunk()),
  updateVote: (room, song, voteValue) =>
    dispatch(voteThunk(room, song, voteValue))
});

export default connect(mapStateToProps, mapDispatchToProps)(Playlist);
