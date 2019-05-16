const router = require('express').Router();
const {
  Room,
  Music,
  Room_Music,
  User_Rooms,
  User,
  User_Music_Room
} = require('../db/models');

//CREATE ROOM ROUTE
//If host change Closed to true   If guest- destory assoc

router.post('/', async (req, res, next) => {
  //FIND IF THEY ARE HOST
  const roomsHosted = await User_Rooms.findAll({
    where: {userId: req.user.id, isHost: true}
  });

  //ARE THEY HOST? Yes? Close the room
  if (roomsHosted.length) {
    const hostedRoom = await Room.findAll({
      where: {
        id: roomsHosted[0].roomId
      }
    });
    hostedRoom[0].closed = true;
    hostedRoom[0].save();
  }

  //IF YOU ARE A GUEST
  // find all rooms they in that are open
  const allOpenRooms = await Room.findAll({
    where: {closed: false},
    include: [{model: User}]
  });

  //LOOP THRU THE ROOMS AND DESTROY ASSOCIATIONS
  for (let i = 0; i < allOpenRooms.length; i++) {
    for (let j = 0; j < allOpenRooms[i].users.length; j++) {
      if (allOpenRooms[i].users[j].id === req.user.id) {
        await User_Rooms.destroy({
          where: {roomId: allOpenRooms[i].id, userId: req.user.id}
        });
      }
    }
  }

  function generateCode() {
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    let roomCode = '';
    for (let i = 0; i < 4; i++) {
      let j =
        Math.floor(Math.random() * (Math.floor(35) - Math.ceil(0) + 1)) + 0;
      roomCode += characters[j];
    }
    return roomCode;
  }

  const roomName = req.body.name;
  const roomKey = generateCode();
  const createdRoom = await Room.create({
    name: roomName,
    roomKey: roomKey,
    closed: false
  });
  await User_Rooms.create({
    roomId: createdRoom.id,
    userId: req.user.id,
    isHost: true
  });
  const members = await createdRoom.getUsers();
  let host = false;
  members.forEach(member => {
    if (member.user_rooms.isHost === true) {
      host = true;
    }
  });
  createdRoom.music = [];
  let roomInfo = {room: createdRoom, host: host, members: members};

  res.json(roomInfo);
});

//Authenticate Key Route for Join Room
router.get('/join/:id', async (req, res, next) => {
  try {
    console.log('in authenticate Router');
    const joinCode = req.params.id;
    const room = await Room.findOne({
      where: {
        roomKey: joinCode,
        closed: false
      },
      include: [{model: Music}]
    });

    console.log('*****room in routes: ', room);

    let host = {};

    if (room.id > 0) {
      const members = await room.getUsers();

      //
      members.forEach(member => {
        if (member.user_rooms.isHost === true) {
          host = member;
        }
      });

      //
      const memberIds = members.map(member => member.id);
      if (memberIds.includes(req.user.id)) {
        const roomInfo = {room: room, members: members, host: host};
        res.json(roomInfo);
      } else {
        await User_Rooms.create({
          roomId: room.id,
          userId: req.user.id,
          isHost: false
        });
        const newMembers = await room.getUsers();

        const roomInfo = {room: room, members: newMembers, host: host};
        console.log('*****roomInfo In router: ', roomInfo);
        res.json(roomInfo);
      }
    } else {
      res.json(room); // send empty object
    }
  } catch (error) {
    console.error(error);
  }
});

router.get('/current-room/:userId', async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const roomInfo = await User.findOne({
      where: {
        id: userId
      },
      include: [
        {
          model: Room,
          where: {
            closed: false
          },
          include: [{model: Music}]
        }
      ]
    });

    const roomId = roomInfo.rooms[0].id;
    const playlistInfo = await Room_Music.findAll({
      where: {
        roomId: roomId,
        hasPlayed: false
      }
    });
    const members = await roomInfo.rooms[0].getUsers();

    res.json({
      playlistInfo: playlistInfo,
      roomInfo: roomInfo,
      members: members
    });
  } catch (error) {
    next(error);
  }
});

router.post('/:roomId/music/:song', async (req, res, next) => {
  try {
    const room = await Room.findByPk(req.params.roomId);
    let songToSearch = req.params.song.replace(/([a-z])([A-Z])/g, '$1 $2');
    const song = await Music.findOne({
      where: {
        name: songToSearch
      }
    });
    if (!room || !song) {
      res.sendStatus(404);
    } else {
      await song.addRoom(room);

      res.send('created successfully');
    }
  } catch (error) {
    next(error);
  }
});

router.put('/close', async (req, res, next) => {
  const closedRoom = await Room.update(
    {closed: true},
    {
      where: {
        roomKey: req.body.roomKey
      }
    }
  );
  res.json(closedRoom);
});

// router.put('/:roomId/music/:musicId', async (req, res, next) => {
//   try {
//     if (req.body.upVote === 'upVote') {
//       let change = await Room_Music.increment('voteCount', {
//         by: 1,
//         where: {
//           roomId: req.params.roomId,
//           musicId: req.params.musicId
//         },
//         include: [{model: Music}]
//       });
//       const song = await Music.findByPk(req.params.musicId);
//       res.send({change, song});
//     } else {
//       let change = await Room_Music.decrement('voteCount', {
//         by: 1,
//         where: {
//           roomId: req.params.roomId,
//           musicId: req.params.musicId
//         },
//         include: [{model: Music}]
//       });
//       const song = await Music.findByPk(req.params.musicId);
//       res.send({change, song});
//     }
//   } catch (error) {
//     next(error);
//   }
// });

router.post('/:roomId/vote/:musicId', async (req, res, next) => {
  try {
    if (req.body.voteValue) {
      const mrId = await Room_Music.findOne({
        where: {
          roomId: req.params.roomId,
          musicId: req.params.musicId,
          hasPlayed: false
        }
      });
      console.log('MR IDDDDDD', mrId);
      const userVote = await User_Music_Room.findOrCreate({
        where: {
          userId: req.user.id,
          roomMusicId: mrId.id,
          voteValue: req.body.voteValue
        }
      });
      console.log('USER VOTE', userVote);

      const allVotes = await User_Music_Room.findAll({
        where: {
          roomMusicId: mrId.id
        }
      });
      const voteCount = allVotes.reduce((accum, curr) => {
        console.log('curr', curr.dataValues, 'accum', accum);
        if (curr.dataValues.voteValue === 'upvote') {
          accum += 1;
        } else {
          accum -= 1;
        }
        return accum;
      }, 1);
      res.json(voteCount);
    } else {
      let mrId = req.body.mrId;
      const allVotes = await User_Music_Room.findAll({
        where: {
          roomMusicId: mrId
        }
      });
      const voteCount = allVotes.reduce((accum, curr) => {
        console.log('curr', curr.dataValues, 'accum', accum);
        if (curr.dataValues.voteValue === 'upvote') {
          accum += 1;
        } else {
          accum -= 1;
        }
        return accum;
      }, 1);
      res.json(voteCount);
    }
  } catch (error) {
    next(error);
  }
});

router.put('/:roomId', async (req, res, next) => {
  try {
    const room = await Room.findByPk(req.params.roomId);
    room.update({closed: true});
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

router.get('/refresh', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const roomInfo = await User.findOne({
      where: {
        id: userId
      },
      include: [
        {
          model: Room,
          where: {
            closed: false
          },
          include: [{model: Music}]
        }
      ]
    });

    const members = await roomInfo.rooms[0].getUsers();
    let isHost = false;
    if (roomInfo.rooms[0].user_rooms.isHost === true) {
      isHost = true;
    }
    console.log('roomInfo', roomInfo);

    const mrId = await Room_Music.findAll({
      where: {
        roomId: roomInfo.rooms[0].id,
        hasPlayed: false
      }
    });

    let state = {
      members: members,
      room: roomInfo.rooms[0],
      host: isHost,
      songArray: mrId
    };

    res.json(state);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
