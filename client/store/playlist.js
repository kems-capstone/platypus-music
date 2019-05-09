/* eslint-disable no-case-declarations */
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

const updateVote = (songId, voteValue) => {
  return {
    type: UPDATE_VOTE,
    voteValue,
    songId
  };
};

export const listenForDataThunk = () => dispatch => {
  socket.on('updateRoom', data => {
    dispatch(updateState(data));
  });
};

export const addSongThunk = (songId, roomId = null) => async dispatch => {
  try {
    let {data} = await axios.get('/api/music/' + songId);
    await axios.post(`/api/rooms/${roomId}/music/${songId}`);
    socket.emit('addedSong', data);

    dispatch(getSong(data));
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
    dispatch(updateVote(songId, voteValue));
  } catch (error) {
    console.error(error.message);
  }
};

export default function(state = inititalState, action) {
  switch (action.type) {
    case ADD_SONG:
      action.song.voteCount = 1;
      console.log('before return vote count', action.song.voteCount);
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
      let songList = state.songList.map(song => {
        if (song.id === action.songId) {
          if (action.voteValue.upVote === 'upVote') {
            song.voteCount++;
            return song;
          } else {
            song.voteCount--;
            return song;
          }
        }
        return song;
      });
      let firstSong = songList[0];
      let notFirstSong = songList.slice(1);

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
