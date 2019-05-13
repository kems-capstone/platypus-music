import axios from 'axios';
import io from 'socket.io-client';
import listenForUpdatePlaylistThunk from './playlist';

const socket = io(window.location.origin);

const ADD_ROOM = 'ADD_ROOM';
const GET_ROOM = 'GET_ROOM';
const JOIN_ROOM = 'JOIN_ROOM';
const UPDATE_ROOM_STATE = 'UPDATE_STATE';
const CLOSE_ROOM = 'CLOSE_ROOM';
const REFRESH_ROOM = 'REFRESH_ROOM';

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

const closeRoom = roomId => {
  return {
    type: CLOSE_ROOM,
    roomId
  };
};

const refreshHost = isHost => {
  return {
    type: REFRESH_ROOM,
    isHost
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
  console.log('room', room);
  const roomInfo = {
    room: room.data.room,
    members: room.data.members,
    host: room.data.host
  };
  if (roomInfo.room) {
    dispatch(joinRoom(roomInfo));
  } else {
    return 'INVALID';
  }
};

export const getRoomThunk = userId => {
  return async function(dispatch) {
    const roomData = await axios.get('/api/rooms/current-room/' + userId);
    socket.emit('getRoomGotPlaylist', roomData.data);

    dispatch(getRoom(roomData.data));
  };
};

export const closeRoomThunk = roomId => async dispatch => {
  await axios.put(`/api/rooms/${roomId}`);
  dispatch(closeRoom(roomId));
};

export const refreshRoom = () => async dispatch => {
  let isHost = false;
  const roomData = await axios.get('/api/rooms/refresh');
  if (roomData.data.rooms[0].user_rooms.isHost === true) {
    isHost = true;
  }
  dispatch(refreshHost(isHost));
  console.log('000000000000XXXXXXXXX', isHost);
};

const initialState = {
  room: {},
  members: [],
  host: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ROOM:
      return {...state, room: action.payload};
    case REFRESH_ROOM:
      return {...state, host: action.isHost};
    case ADD_ROOM:
      return action.roomObject;
    case JOIN_ROOM:
      return action.roomInfo;
    case CLOSE_ROOM:
      return initialState;
    default:
      return state;
  }
}
