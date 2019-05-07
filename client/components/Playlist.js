import React, {Component} from 'react';
import Player from './Player';
import {connect} from 'react-redux';
import {addSongThunk} from '../store/playlist';

const audio = document.createElement('audio');

class Playlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      artistSearch: '',
      selectedSong: '',
      playing: false
    };
    this.handleArtistSearch = this.handleArtistSearch.bind(this);
    this.playSong = this.playSong.bind(this);
  }

  componentDidMount() {
    this.setState({selectedSong: this.props.playlist.currentSong.audioUrl});
  }
  handleArtistSearch() {
    console.log('before state', this.state);
    this.props.addSong(this.state.artistSearch);
    console.log('after state', this.state);
  }

  playSong() {
    //Stop any currently playing song
    audio.pause();

    //Play newly selected song
    audio.src = this.props.playlist.currentSong.audioUrl;
    this.setState(prevState => ({playing: !prevState.playing}));
    audio.load();
    audio.play();
  }

  render() {
    console.log('propppps', this.props);
    return (
      <div>
        <Player />
        <br />
        <form>
          <input
            type="text"
            value={this.state.artistSearch}
            onChange={event => {
              this.setState({artistSearch: event.target.value});
            }}
            placeholder="search for artist"
          />
          <button type="button" onClick={this.handleArtistSearch}>
            Search
          </button>
        </form>
        <br />
        <br />
        <audio
          src={this.props.playlist.currentSong.audioUrl}
          onClick={this.playSong}
          controls
          id="audio"
        />
        <div>
          {this.props.playlist.songList.map(index => {
            return <div>{index.name}</div>;
          })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  playlist: state.playlist
});

const mapDispatchToProps = dispatch => ({
  addSong: song => dispatch(addSongThunk(song))
});

export default connect(mapStateToProps, mapDispatchToProps)(Playlist);
