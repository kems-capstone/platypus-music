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

const getRoom = roomData => {
  return {
    type: GET_ROOM,
    payload: roomData
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
    dispatch(addRoom(createdRoom.data));
  };
};

export const joinRoomThunk = key => async dispatch => {
  const room = await axios.get('/api/rooms/join/' + key);


  const roomInfo = {
    room: room.data.room,
    members: room.data.members,
    host: room.data.host
  };
  if (roomInfo.room) {
    dispatch(joinRoom(roomInfo));
  } else {
    return  "INVALID";
  }
};

export const getRoomThunk = userId => {
  return async function(dispatch) {
    console.log('THIS IS THE USERID IN THE THUNK', userId);
    const roomData = await axios.get('/api/rooms/current-room/' + userId);
    dispatch(getRoom(roomData.data));
  };
};

const initialState = {
  room: {},
  members: [],
  host: ''
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ROOM:
      return {...state, room: action.payload};
    case ADD_ROOM:
      return action.roomObject;
    case JOIN_ROOM:
      return action.roomInfo;
    default:
      return state;
  }
}
