import axios from 'axios';

const ADD_ROOM = 'ADD_ROOM';

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

export const authenticateKeyThunk = key => async dispatch => {

  const roomInfo = await axios.get('/api/rooms/join/' + key)

  if (roomInfo.data){
    dispatch(addRoom(roomInfo.data))

  } else {
    console.log("INVALID ROOM KEY")
    return 'Invalid room key'
  }
}

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_ROOM:
      return action.roomObject;
    default:
      return state;
  }
}
