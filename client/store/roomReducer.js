import axios from 'axios';
import io from 'socket.io-client';

const socket = io(window.location.origin);

const ADD_ROOM = 'ADD_ROOM';
const GET_ROOM = 'GET_ROOM';
const JOIN_ROOM = 'JOIN_ROOM';
const UPDATE_ROOM_STATE = 'UPDATE_STATE';


const updateRoomState = otherProps => {
  return {
    type: UPDATE_ROOM_STATE,
    otherProps
  };
};

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

export const listenForRoomDataThunk = () => dispatch => {
  socket.on('updateRoom', data => {
    dispatch(updateRoomState(data));
  });
};

export const addRoomThunk = (roomName, user) => {
  return async function(dispatch) {
    const createdRoom = await axios.post('/api/rooms', {name: roomName});

    const roomInfo = {room: createdRoom.data, members: [user], host: user};

    dispatch(addRoom(roomInfo));
  };
};

export const joinRoomThunk = key => async dispatch => {
  const room = await axios.get('/api/rooms/join/' + key);
  const roomInfo = {room: room.data.room, members: room.data.members};

  console.log('room info in thunk', roomInfo)

  if (roomInfo.room) {
    dispatch(joinRoom(roomInfo.data));
  } else {
    return 'Invalid room key';
  }
};

const initialState = {
  room: {},
  members: [],
  host: ''
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_ROOM:
      return action.roomObject;
    case JOIN_ROOM:
      return {...state, members: action.members};
    default:
      return state;
  }
}
