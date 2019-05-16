/* eslint-disable no-case-declarations */
import axios from 'axios';
import socket from '../socket';

const inititalState = {
  songList: [],
  currentSong: {}
};

const ADD_SONG = 'ADD_SONG';
const REMOVE_PLAYLIST_SONG = 'REMOVE_PLAYLIST_SONG';
const UPDATE_VOTE = 'UPDATE_VOTE';
const UPDATE_PLAYLIST = 'UPDATE_PLAYLIST';
const DELETE_SONG = 'DELETE_SONG';

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

const deleteSong = songId => {
  return {
    type: DELETE_SONG,
    songId
  };
};

//////SOCKETS

export const listenForAddPlaylistThunk = () => dispatch => {
  socket.on('songAdded', data => {
    dispatch(addSong(data));
  });
};
export const listenForEndSongThunk = () => dispatch => {
  socket.on('songEnded', data => {
    dispatch(removePlaylistSong(data));
  });
};
export const listenForVoteThunk = () => dispatch => {
  socket.on('voteUpdated', updatedSong => {
    dispatch(updateVote(updatedSong));
  });
};
export const listenForUpdatePlaylistThunk = () => dispatch => {
  socket.on('getRoomGotPlaylist', playlist => {
    // let unplayedMusic = playlist.playlistInfo; // has votes
    // let allMusic = playlist.roomInfo.rooms[0].music; //Has info
    console.log('SL"IDKJFHS:DLKFJH:DSLKFHSDL', playlist);

    dispatch(updatePlaylist(playlist));
  });
};

/////////////

export const addSongThunk = (song, roomId = null) => async dispatch => {
  try {
    let {data} = await axios.get('/api/music/' + song);
    await axios.post(`/api/rooms/${roomId}/music/${song}`);
    socket.emit('addedSong', data);
    dispatch(addSong(data));
  } catch (error) {
    console.error(error.message);
  }
};

export const voteThunk = (roomId, song, voteValue) => async dispatch => {
  try {
    let {data} = await axios.post(`/api/rooms/${roomId}/vote/${song.id}`, {
      voteValue: voteValue
    });

    song.voteCount = data;

    socket.emit('songVoted', song);

    dispatch(updateVote(song));
  } catch (error) {
    console.error(error.message);
  }
};

export const songPlayed = (songId, roomId) => async dispatch => {
  try {
    await axios.put(`/api/music/${songId}/room/${roomId}`);
  } catch (error) {
    console.error(error.message);
  }
};

export const deleteSongThunk = (songId, roomId) => async dispatch => {
  try {
    await axios.delete(`/api/music/${songId}/room/${roomId}`);
    dispatch(deleteSong(songId));
  } catch (error) {
    console.error(error.message);
  }
};

export default function(state = inititalState, action) {
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
        currentSong: newSonglist[0],
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
    case DELETE_SONG:
      let shortened = state.songList.filter(song => song.id !== action.songId);
      return {...state, songList: shortened};
    default:
      return state;
  }
}
