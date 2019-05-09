import React, {Component} from 'react';
import Player from './Player';
import {connect} from 'react-redux';
import {addSongThunk, listenForDataThunk, voteThunk} from '../store/playlist';
import SearchForm from './SearchForm';
import io from 'socket.io-client';
import JoinRoom from './JoinRoom';

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
    return (
      <div>
        <JoinRoom />
        <Player />
        <br />
        <SearchForm handleSubmit={this.handleSubmit} />
        <br />
        <br />

        <audio
          autoPlay={true}
          onEnded={this.nextTrack}
          src={this.state.selectedSong}
          onClick={this.handleSubmit}
          controls
          id="audioPlayer"
        />

        <div>
          {this.props.playlist.songList.map(index => {
            return (
              <div key={index.id}>
                <h4>{index.name}</h4>
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
                </button>
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
  room: state.room
});

const mapDispatchToProps = dispatch => ({
  addSong: (song, room) => dispatch(addSongThunk(song, room)),
  updateStore: () => dispatch(listenForDataThunk()),
  updateVote: (room, song, voteValue) =>
    dispatch(voteThunk(room, song, voteValue))
});

export default connect(mapStateToProps, mapDispatchToProps)(Playlist);
