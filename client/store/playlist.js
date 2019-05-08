import axios from 'axios';
import io from 'socket.io-client';

const socket = io(window.location.origin);

const inititalState = {
  songList: [],
  currentSong: {}
};

const ADD_SONG = 'ADD_SONG';
const UPDATE_STATE = 'UPDATE_STATE';

const updateState = otherProps => {
  return {
    type: UPDATE_STATE,
    otherProps
  };
};

const getSong = song => {
  return {
    type: ADD_SONG,
    song
  };
};

export const listenForDataThunk = () => dispatch => {
  socket.on('updateRoom', data => {
    dispatch(updateState(data));
  });
};

export const addSongThunk = (song, roomId = null) => async dispatch => {
  try {
    let {data} = await axios.get('/api/music/' + song);
    const posted = await axios.post(`/api/rooms/${roomId}/music/${song}`);
    socket.emit('addedSong', data);

    dispatch(getSong(data));
  } catch (error) {
    console.error(error.message);
  }
};

export const voteThunk = (roomId, songId) => dispatch => {};

export default function(state = inititalState, action) {
  switch (action.type) {
    case ADD_SONG:
      return {
        currentSong: action.song,
        songList: [...state.songList, action.song]
      };
    case UPDATE_STATE:
      return {
        currentSong: action.otherProps.audioUrl,
        songList: [...state.songList, action.otherProps]
      };
    default:
      return state;
  }
}
