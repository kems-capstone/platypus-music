import React, {Component} from 'react';
import Player from './Player';
import {connect} from 'react-redux';
import {addSongThunk} from '../store/playlist';
import SearchForm from './SearchForm'

const audio = document.createElement('audio');

class Playlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      artistSearch: '',
      selectedSong: '',
      playing: false
    };
    this.playSong = this.playSong.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    this.setState({selectedSong: this.props.playlist.currentSong.audioUrl});
  }

  handleSubmit(event){
    event.preventDefault()
    this.props.addSong(this.props.form.search.values.trackSearch);
  }

  playSong() {

    audio.pause();

    audio.src = this.props.playlist.currentSong.audioUrl;
    this.setState(prevState => ({playing: !prevState.playing}));
    audio.load();
    audio.play();
  }

  render() {

    return (
      <div>
        <Player />
        <br />
        <SearchForm  handleSubmit={this.handleSubmit}/>
        <br />
        <br />
        <audio
          src={this.props.playlist.currentSong.audioUrl}
          onClick={this.playSong}
          controls
          id="audioPlayer"
        />

        <ol>
          {this.props.playlist.songList.map(index => {
            return <div key={index.id}>{index.name}</div>;
          })}
        </ol>
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
