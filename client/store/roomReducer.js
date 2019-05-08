import axios from 'axios';

const ADD_ROOM = 'ADD_ROOM';
const GET_ROOM = 'GET_ROOM';

const addRoom = roomObject => {
  return {
    type: ADD_ROOM,
    roomObject
  };
};

export const addRoomThunk = roomName => {
  return async function(dispatch) {
    console.log('ROOM NAME', roomName);
    const createdRoom = await axios.post('/api/rooms', {name: roomName});
    dispatch(addRoom(createdRoom));
  };
};

const getRoom = foundRoom => {
  return {
    type: GET_ROOM,
    foundRoom
  };
};

export const getRoomThunk = () => {
  return async function(dispatch) {
    const foundRoom = await axios.get();
    dispatch(getRoom(foundRoom));
  };
};

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_ROOM:
      return action.roomObject;
    case GET_ROOM:
      return action.foundRoom;
    default:
      return state;
  }
}
