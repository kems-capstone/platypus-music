const router = require('express').Router();
const {Room} = require('../db/models');

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
  res.json(createdRoom);
});

//Authenticate Key Route for Join Room
router.get('/join/:id', async (req, res, next) => {
  console.log('*****req.body: ', req.body);

  const joinCode = req.params.id;
  const room = await Room.findOne({
    where: {
      roomKey: joinCode,
      closed: false
    }
  });

  res.json(room);
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

module.exports = router;
