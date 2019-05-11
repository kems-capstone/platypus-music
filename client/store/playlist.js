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

const addPlaylistSong = songList => {
  return {
    type: ADD_PLAYLIST_SONG,
    songList
  };
};
const removePlaylistSong= songList => {
  console.log('*****removePlaylistSong action dispatcher fired  songlist =  ', songList);
  return {
    type: REMOVE_PLAYLIST_SONG,
    songList
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
    dispatch(addSong(data));
  });
};
export const listenForEndSongThunk = () => dispatch => {
  socket.on('songEnded', data => {
    console.log('Listener in store fired !!!!!!!!!!', data)
    console.log('Socket id in store = ', socket.id)
    dispatch(removePlaylistSong(data));
  });
};
export const listenForVoteThunk = () => dispatch => {
  socket.on("voteUpdated", updatedSong => {
    dispatch(updateVote(updatedSong));
  });
};








/////////////

export const addSongThunk = (songId, roomId = null) => async dispatch => {
  try {
    let {data} = await axios.get('/api/music/' + songId);
    await axios.post(`/api/rooms/${roomId}/music/${songId}`);
    socket.emit('addedSong', data);
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
  switch (action.type) {
    case ADD_SONG:
      action.song.voteCount = 1;
      console.log('*****action: ', action);
      return {
        currentSong: action.song,
        songList: [...state.songList, action.song]
      };




    case REMOVE_PLAYLIST_SONG:
      console.log('in reducer action', action)
      let newSonglist = state.songList.slice(1)

      console.log("newSongList", newSonglist)
      return {
        currentSong: newSonglist,
        songList: newSonglist
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
