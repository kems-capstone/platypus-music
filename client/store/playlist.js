import axios from 'axios';
import io from 'socket.io-client';

const socket = io(window.location.origin);

const inititalState = {
  songList: [],
  currentSong: {}
};

const ADD_SONG = 'ADD_SONG';
const UPDATE_STATE = 'UPDATE_STATE';
const UPDATE_VOTE = 'UPDATE_VOTE';

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

const updateVote = (voteValue, song) => {
  return {
    type: UPDATE_VOTE,
    voteValue,
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

export const voteThunk = (roomId, songId, voteValue) => async dispatch => {
  try {
    console.log('songid', songId);
    let {data} = await axios.put(
      `/api/rooms/${roomId}/music/${songId}`,
      voteValue
    );
    dispatch(updateVote(songId, voteValue));
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
    case UPDATE_STATE:
      return {
        currentSong: action.otherProps.audioUrl,
        songList: [...state.songList, action.otherProps]
      };
    case UPDATE_VOTE:
      let newSonglist = state.songList.filter(song => {
        if (song.id === action.song.id) {
          if (action.voteValue === 'upVote') {
            song.voteCount++;
          } else {
            song.voteCount--;
          }
        }
      });

      return {...state, songList: newSonglist};
    default:
      return state;
  }
}
