import React, {Component} from 'react';
import Player from './Player';
import {connect} from 'react-redux';
import {addSongThunk, listenForDataThunk} from '../store/playlist';
import SearchForm from './SearchForm';
import io from 'socket.io-client';

const socket = io(window.location.origin);


const audio = document.createElement('audio');

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
      this.props.addSong(this.props.form.search.values.trackSearch);
    } catch (error) {
      console.error(error.message);
    }
  }

  nextTrack() {
    if (this.props.playlist.songList.length >= 1) {
      this.props.playlist.songList.shift();
      this.setState({selectedSong: this.props.playlist.songList[0].audioUrl});
    }
  }

  render() {
    return (
      <div>
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
            return <div key={index.id}>{index.name}</div>;
          })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  playlist: state.playlist,
  form: state.form
});

const mapDispatchToProps = dispatch => ({
  addSong: song => dispatch(addSongThunk(song)),
  updateStore: () => dispatch(listenForDataThunk())
});

export default connect(mapStateToProps, mapDispatchToProps)(Playlist);
