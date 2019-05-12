/* eslint-disable no-case-declarations */
import axios from 'axios';
import io from 'socket.io-client';

const socket = io(window.location.origin);

const inititalState = {
  songList: [],
  currentSong: {}
};

const ADD_SONG = 'ADD_SONG';
const REMOVE_PLAYLIST_SONG = 'REMOVE_PLAYLIST_SONG';
const UPDATE_VOTE = 'UPDATE_VOTE';
const UPDATE_PLAYLIST = 'UPDATE_PLAYLIST';

const addPlaylistSong = songList => {
  return {
    type: ADD_PLAYLIST_SONG,
    songList
  };
};
const removePlaylistSong = songList => {
  return {
    type: REMOVE_PLAYLIST_SONG,
    songList
  };
};

const updatePlaylist = playlist => {
  return {
    type: UPDATE_PLAYLIST,
    playlist
  };
};

const addSong = song => {
  return {
    type: ADD_SONG,
    song
  };
};

const updateVote = newSongData => {
  return {
    type: UPDATE_VOTE,
    newSongData
  };
};

//////SOCKETS

export const listenForAddPlaylistThunk = () => dispatch => {
  socket.on('songAdded', data => {
    console.log('*****playlist 1')
    dispatch(addSong(data));
  });
};
export const listenForEndSongThunk = () => dispatch => {
  socket.on('songEnded', data => {
    console.log('*****playlist 2')
    dispatch(removePlaylistSong(data));
  });
};
export const listenForVoteThunk = () => dispatch => {
  socket.on('voteUpdated', updatedSong => {
    console.log('*****playlist 3')
    dispatch(updateVote(updatedSong));
  });
};
export const listenForUpdatePlaylistThunk = () => dispatch => {
  console.log('LISTEN FOR UPDATE PLAYLIST THUNK');
  socket.on('getRoomGotPlaylist', playlist =>{
    console.log('get room goot playlist in Playlist.js', playlist);


    dispatch(updatePlaylist(playlist));
  })
};

/////////////

export const addSongThunk = (songId, roomId = null) => async dispatch => {
  try {
    let {data} = await axios.get('/api/music/' + songId);
    await axios.post(`/api/rooms/${roomId}/music/${songId}`);
    socket.emit('addedSong', data);

    console.log('socket add thunk emitted socket id ', socket.id);
  } catch (error) {
    console.error(error.message);
  }
};

export const voteThunk = (roomId, songId, voteValue) => async dispatch => {
  try {
    let {data} = await axios.put(
      `/api/rooms/${roomId}/music/${songId}`,
      voteValue
    );
    let songVote = data.song;
    songVote.voteCount = data.change[0][0][0].voteCount;
    socket.emit('songVoted', songVote);
    dispatch(updateVote(songVote));
  } catch (error) {
    console.error(error.message);
  }
};

export default function(state = inititalState, action) {
  console.log('*****action: ', action);
  switch (action.type) {
    case ADD_SONG:
      action.song.voteCount = 1;
      return {
        currentSong: action.song,
        songList: [...state.songList, action.song]
      };

    case REMOVE_PLAYLIST_SONG:
      let newSonglist = state.songList.slice(1);
      return {
        currentSong: newSonglist,
        songList: newSonglist
      };

    case UPDATE_PLAYLIST:
      return {
        ...state,
        songList: action.playlist
      };

    case UPDATE_VOTE:
      let filtered = state.songList.filter(
        song => song.id !== action.newSongData.id
      );
      let newState = [...filtered, action.newSongData];
      let firstSong = newState[0];
      let notFirstSong = newState.slice(1);

      notFirstSong.sort((a, b) => {
        return a.voteCount > b.voteCount
          ? -1
          : b.voteCount > a.voteCount ? 1 : 0;
      });
      return {...state, songList: [firstSong, ...notFirstSong]};
    default:
      return state;
  }
}
