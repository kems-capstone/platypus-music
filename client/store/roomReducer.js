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

const joinRoom = roomInfo => {
  return {
    type: JOIN_ROOM,
    roomInfo
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
    console.log('*****roomInfo CREATE: ', roomInfo);

    dispatch(addRoom(roomInfo));
  };
};

export const joinRoomThunk = key => async dispatch => {
  const room = await axios.get('/api/rooms/join/' + key);
  const roomInfo = {room: room.data.room, members: room.data.members};

  console.log('*****roomInfo JOIN: ', roomInfo);
  if (roomInfo.room) {
    dispatch(joinRoom(roomInfo));
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
  console.log('*****action BBBBBBBBBBBB: ', action);
  switch (action.type) {
    case ADD_ROOM:
      return action.roomObject
    case JOIN_ROOM:
      return {...state, room: action.roomInfo.room, members: action.roomInfo.members};
    default:
      return state;
  }
}
