const Sequelize = require('sequelize');
const db = require('../db');

const User_Rooms = db.define('user_rooms', {
  roomId: {
    type: Sequelize.INTEGER
  },
  userId: {
    type: Sequelize.INTEGER
  },
  isHost: {
    type: Sequelize.BOOLEAN
  }
});

module.exports = User_Rooms;
