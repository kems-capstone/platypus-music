import React, {Component} from 'react';
import Player from './Player';
import {connect} from 'react-redux';
import {addSongThunk, listenForAddPlaylistThunk, voteThunk, listenForVoteThunk, listenForEndSongThunk} from '../store/playlist';
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
    this.props.addedToPlaylist();
    this.props.listenForVotes()
    this.props.listenForSongEnd()
  }

  static getDerivedStateFromProps(props) {
    if (props.playlist.songList && props.playlist.songList[0]) {
      return {
        selectedSong: props.playlist.songList[0].audioUrl
      };
    } else {
      return ''
    }
  }

  handleSubmit(event) {
    try {
      event.preventDefault();

      this.props.addSong(
        this.props.form.search.values.trackSearch,
        this.props.room.room.roomInfo.rooms[0].id
      );
    } catch (error) {
      console.error(error.message);
    }
  }

  nextTrack() {
    if (this.props.playlist.songList.length >= 1) {


      socket.emit('endedSong', this.props.playlist.songList);
     console.log('***** socket endedSong fired on PlayC  id = ',  socket.id);

      this.setState({selectedSong: this.props.playlist.songList[0].audioUrl});
    }
  }

  render() {
    return (
      <div>
        {this.props.room.host.id &&
        this.props.room.host.id === this.props.user.id ? (
          <Player
            selectedSong={this.state.selectedSong}
            nextTrack={this.nextTrack}
          />
        ) : (
          <div>
            <h4>Something can go here later</h4>
          </div>
        )}

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
  listenForVotes: ()=>dispatch(listenForVoteThunk()),
  listenForSongEnd: () => dispatch(listenForEndSongThunk())

});

export default connect(mapStateToProps, mapDispatchToProps)(Playlist);
