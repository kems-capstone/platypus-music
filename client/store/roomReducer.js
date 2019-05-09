import axios from 'axios';

const ADD_ROOM = 'ADD_ROOM';
const GET_ROOM = 'GET_ROOM';
const JOIN_ROOM = 'JOIN_ROOM'

const addRoom = roomObject => {
  return {
    type: ADD_ROOM,
    roomObject
  };
};
const joinRoom = roomObject => {
  return {
    type: JOIN_ROOM,
    roomObject
  };
};

export const addRoomThunk = (roomName, user) => {
  return async function(dispatch) {
    console.log('USER::::', user)
    const createdRoom = await axios.post('/api/rooms', {name: roomName});
    console.log('*****createdRoom: ', createdRoom);
    const roomInfo = {room: createdRoom.data, members: [user], host: user}
    console.log('*****roomInfo: ', roomInfo);
    dispatch(addRoom(roomInfo));
  };
};

export const authenticateKeyThunk = key => async dispatch => {
  const room = await axios.get('/api/rooms/join/' + key);
  // roomInfo.data.hostId = 6  <== this is to test guest vs host functionality in room component, will need this thunk to pull host id from through table
  const roomInfo = {room: room.data.room, members: room.data.members}
  console.log('*****roomInfo JOIN THUNK: ', roomInfo);
  if (roomInfo.room) {
    dispatch(joinRoom(roomInfo.data));
  } else {
    return 'Invalid room key';
  }
};

const initialState = {
  room: {},
  members: [],
  host: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_ROOM:
      return action.roomObject;
    case JOIN_ROOM:
    return {...state, members:  action.members}
    default:
      return state;
  }
}
