import React, {Component} from 'react';
import Player from './Player';
import {connect} from 'react-redux';
import {addSongThunk} from '../store/playlist';
import SearchForm from './SearchForm';
import io from 'socket.io-client';

const socket = io(window.location.origin);

socket.on('connect', () => {
  console.log('Connected! hellooooooo');
});

const audio = document.createElement('audio');

class Playlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSong: '',
      counter: 0
    };
    this.onClick = this.onClick.bind(this);
    this.nextTrack = this.nextTrack.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    console.log(socket);
    socket.on('updateRoom', () => {
      console.log('in socket CDM');
    });

    // socket.on('addClick', () =>
    //   this.setState(prevState => ({counter: prevState.counter + 1}))
    // );
  }

  static getDerivedStateFromProps(props) {
    socket.emit('updateRoom', props.playlist.songList);
    if (props.playlist.songList[0]) {
      return {
        selectedSong: props.playlist.songList[0].audioUrl
      };
    }
  }

  handleSubmit(event) {
    try {
      event.preventDefault();
      this.props.addSong(this.props.form.search.values.trackSearch);
      // this.setState({selectedSong: this.props.playlist.songList[0].audioUrl});
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

  onClick() {
    console.log('clicked');
    socket.emit('addClick', this.state.counter);
  }

  render() {
    console.log('props playlist', this.props.playlist);
    return (
      <div>
        <h1>{this.state.counter}</h1>
        <button type="button" onClick={this.onClick}>
          Click me
        </button>
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
  addSong: song => dispatch(addSongThunk(song))
});

export default connect(mapStateToProps, mapDispatchToProps)(Playlist);
