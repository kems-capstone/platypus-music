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
    console.log('*****roomName: ', roomName);
    const createdRoom = await axios.post('/api/rooms', {name: roomName});
    console.log('*****createdRoom: ', createdRoom);
    dispatch(addRoom(createdRoom.data));
  };
};

export const authenticateKeyThunk = key => async dispatch => {
  const roomInfo = await axios.get('/api/rooms/join/' + key);

  if (roomInfo.data) {
    dispatch(addRoom(roomInfo.data));
  } else {
    return 'Invalid room key';
  }
};

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_ROOM:
      return action.roomObject;
    default:
      return state;
  }
}
