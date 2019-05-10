const router = require('express').Router();
const {Room, Music, Room_Music, User_Rooms, User} = require('../db/models');

// router.get('/', async (req, res, next) => {
//   const rooms = await Room.findAll({});
//   res.json(rooms);
// });

router.post('/', async (req, res, next) => {
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

  console.log('*****createdRoom in routes: ', roomInfo);
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
    console.log('*****room.id: ', room);

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
      console.log('*****memberIds: ', memberIds);
      if (memberIds.includes(req.user.id)) {
        console.log('MEMBER EXISTs');
        const roomInfo = {room: room, members: members, host: host};
        res.json(roomInfo);
      } else {
        console.log('MEMBER DOESNT EXIST');
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

router.get('/current-room', async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const roomInfo = await User.findOne({
      where: {
        id: userId
      },
      include: [
        {
          model: Room,
          where: {
            closed: false
          }
        }
      ]
    });
    console.log(roomInfo);
    res.json(roomInfo);
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
    const room = await Room.findByPk(req.params.roomId);
    const song = await Music.findByPk(req.params.musicId);
    console.log('body', req.body);
    if (req.body.upVote === 'upVote') {
      let increment = await Room_Music.increment('voteCount', {
        by: 1,
        where: {
          roomId: room.id,
          musicId: song.id
        }
      });
      res.send(increment);
    } else {
      let decrement = await Room_Music.decrement('voteCount', {
        by: 1,
        where: {
          roomId: room.id,
          musicId: song.id
        }
      });
      res.send(decrement);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
