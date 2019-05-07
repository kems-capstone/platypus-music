import React, {Component} from 'react'
import Player from './Player'
import {connect} from 'react-redux'
import {addSongThunk} from '../store/playlist'
import SearchForm from './SearchForm'

const audio = document.createElement('audio')

class Playlist extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedSong: ''
    }

    this.nextTrack = this.nextTrack.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async handleSubmit(event) {
    try {
      event.preventDefault()
      await this.props.addSong(this.props.form.search.values.trackSearch)
      this.setState({selectedSong: this.props.playlist.songList[0].audioUrl})
    } catch (error) {
      console.error(error.message)
    }
  }

  nextTrack() {
    if (this.props.playlist.songList.length >= 1) {
      this.props.playlist.songList.shift()
      this.setState({selectedSong: this.props.playlist.songList[0].audioUrl})
    }
  }

  render() {
    console.log('props playlist', this.props.playlist)
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
          id="audio"
        />

        <div>
          {this.props.playlist.songList.map(index => {
            return <div key={index.id}>{index.name}</div>
          })}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  playlist: state.playlist,
  form: state.form
})

const mapDispatchToProps = dispatch => ({
  addSong: song => dispatch(addSongThunk(song))
})

export default connect(mapStateToProps, mapDispatchToProps)(Playlist)
