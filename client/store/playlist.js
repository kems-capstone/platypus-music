import axios from 'axios';

const inititalState = {
  songList: [],
  currentSong: {}
};

const ADD_SONG = 'ADD_SONG';

const getSong = song => {
  return {
    type: ADD_SONG,
    song
  };
};

export const addSongThunk = song => async dispatch => {
  console.log('in the thunk', song);
  try {
    let {data} = await axios.get('/api/music/' + song);
    console.log('dataaaaa', data);
    dispatch(getSong(data));
  } catch (error) {
    console.error(error.message);
  }
};

export default function(state = inititalState, action) {
  switch (action.type) {
    case ADD_SONG:
      return {
        currentSong: action.song,
        songList: [...state.songList, action.song]
      };
    default:
      return state;
  }
}
