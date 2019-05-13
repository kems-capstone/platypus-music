const router = require('express').Router();
const {Room, Music, Room_Music, User_Rooms, User} = require('../db/models');

router.post('/', async (req, res, next) => {

  //See if a room is open and if so close it

  // IN ITS CURRENT STATE ITS CLOSING ALL THE ROOMS NOT JUST THE USERS ROOM
  const  user = await Room.update({closed: true}, {
    where:
    {closed: false},

    include: [{model: User, where: {id: req.user.id,}}]
})

console.log('*****userrr: ', user);



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
  let host = {};
  members.forEach(member => {
    if (member.user_rooms.isHost === true) {
      host = member;
    }
  });
  let roomInfo = {room: createdRoom, host: host, members: members};

  res.json(roomInfo);
});

//Authenticate Key Route for Join Room
router.get('/join/:id', async (req, res, next) => {
  try {
    const joinCode = req.params.id;
    const room = await Room.findOne({
      where: {
        roomKey: joinCode,
        closed: false
      }
    });

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

    res.json({playlistInfo: playlistInfo, roomInfo: roomInfo});
  } catch (error) {
    next(error);
  }
});

router.post('/:roomId/music/:musicId', async (req, res, next) => {
  try {
    const room = await Room.findByPk(req.params.roomId);
    const song = await Music.findByPk(req.params.musicId);
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

router.put('/:roomId/music/:musicId', async (req, res, next) => {
  try {
    if (req.body.upVote === 'upVote') {
      let change = await Room_Music.increment('voteCount', {
        by: 1,
        where: {
          roomId: req.params.roomId,
          musicId: req.params.musicId
        },
        include: [{model: Music}]
      });
      const song = await Music.findByPk(req.params.musicId);
      res.send({change, song});
    } else {
      let change = await Room_Music.decrement('voteCount', {
        by: 1,
        where: {
          roomId: req.params.roomId,
          musicId: req.params.musicId
        },
        include: [{model: Music}]
      });
      const song = await Music.findByPk(req.params.musicId);
      res.send({change, song});
    }
  } catch (error) {
    next(error);
  }
});

router.put('/:roomId', async (req, res, next) => {
  try {
    const room = await Room.findByPk(req.params.roomId);
    room.update({closed: true});
    res.sendStatus(203);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
