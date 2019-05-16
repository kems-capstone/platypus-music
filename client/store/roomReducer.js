import axios from 'axios';
import io from 'socket.io-client';
import {voteThunk} from './playlist';
import history from '../history';

import socket from '../socket';
import {Playlist} from '../components';

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
    roomData
  };
};

const closeRoom = roomId => {
  return {
    type: CLOSE_ROOM,
    roomId
  };
};

const refreshRoomState = roomState => {
  return {
    type: REFRESH_ROOM,
    roomState
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

    history.push(`/room/${createdRoom.data.room.id}`);
  };
};

export const joinRoomThunk = key => async dispatch => {
  console.log('In Join Room Thunk');
  const room = await axios.get('/api/rooms/join/' + key);
  console.log('room in join room thunk', room);
  const roomInfo = {
    room: room.data.room,
    members: room.data.members,
    host: false
  };
  console.log('roomInfo in join room thunk', roomInfo);

  if (roomInfo.room) {
    dispatch(joinRoom(roomInfo));
    history.push(`/room/${roomInfo.room.id}`);
  } else {
    return 'INVALID';
  }
};

export const getRoomThunk = userId => {
  return async function(dispatch) {
    const roomData = await axios.get('/api/rooms/current-room/' + userId);
    socket.emit('getRoomGotPlaylist', roomData.data);

    //Maybe dispatch grab playlist
    let state = {
      room: roomData.data.roomInfo.rooms[0],
      host: roomData.data.roomInfo.rooms[0].user_rooms.isHost,
      members: roomData.data.members
    };

    dispatch(getRoom(state));
  };
};

export const closeRoomThunk = roomId => async dispatch => {
  await axios.put(`/api/rooms/${roomId}`);

  dispatch(closeRoom(roomId));
  socket.emit('hostEnded');
  history.push('/dashboard');
};
const refreshVotes = async (roomId, song, mrId) => {
  let {data} = await axios.post(`/api/rooms/${roomId}/vote/${song}`, {
    mrId: mrId
  });
  return data;
};
export const refreshRoom = () => async dispatch => {
  const roomData = await axios.get('/api/rooms/refresh');
  let arr = [];
  for (let i = 0; i < roomData.data.songArray.length; i++) {
    let song = roomData.data.songArray[i];
    let voteCount = await refreshVotes(song.roomId, song.musicId, song.id);
    console.log('VOTE COUNTTT', voteCount);
    song.voteCount = voteCount;
    arr.push(song);
  }
  console.log('ARRRR', arr); //votes
  // let songsWithVotes = roomData.data.songArray.map(song => {
  //   let voteCount = refreshVotes(song.roomId, song.musicId, song.id);
  //   console.log('VOTE COUNTTT', voteCount);
  //   song.voteCount = voteCount;
  //   return song;
  // });
  // console.log('SONGS WITH VOTES', songsWithVotes);
  let songInfo = roomData.data.room.music;

  console.log('roomData.data.room.music', roomData.data.room.music);

  let newPlaylist = [];
  for (let i = 0; i < songInfo.length; i++) {
    let song = songInfo[i];
    for (let j = 0; j < arr.length; j++) {
      if (song.id === arr[j].musicId) {
        song.voteCount = arr[j].voteCount;
        newPlaylist.push(song);
      }
    }
  }

  newPlaylist.sort((a, b) => {
    return a.voteCount > b.voteCount ? -1 : b.voteCount > a.voteCount ? 1 : 0;
  });

  roomData.data.room.music = newPlaylist;
  socket.emit('getRoomGotPlaylist', newPlaylist);

  dispatch(refreshRoomState(roomData.data));
};

const initialState = {
  room: {},
  members: [],
  host: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ROOM:
      return action.roomData;
    case REFRESH_ROOM:
      return action.roomState;
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
