const router = require('express').Router();
const {Room} = require('../db/models');

router.get('/', async (req, res, next) => {
  const rooms = await Room.findAll({});
  res.json(rooms);
});

router.post('/', async (req, res, next) => {
  const roomName = req.body.name;
  const createdRoom = await Room.create({name: roomName, closed: false});
  res.json(createdRoom);
});

module.exports = router;
