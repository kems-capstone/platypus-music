import axios from 'axios';

const inititalState = {
  songList: [],
  currentSong: {}
};

const ADD_SONG = 'ADD_SONG';
const UPDATE_STATE = 'UPDATE_STATE';

const updateState = otherProps =>{
  return {
    type: UPDATE_STATE,
    otherProps
  }

}

const getSong = song => {
  return {
    type: ADD_SONG,
    song
  };
};


export const updateStore = (otherProps) => dispatch => {
  try {
    console.log('Other props in update store', otherProps)
    dispatch(updateState(otherProps))
  } catch (error) {
    console.error(error.message)
  }

}


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
    case UPDATE_STATE:
      return{
        currentSong: action.currentSong,
        songList: action.songList
      }
    default:
      return state;
  }
}
