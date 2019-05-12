const Sequelize = require('sequelize');
const db = require('../db');

const Room_Music = db.define('room_music', {
  roomId: {
    type: Sequelize.INTEGER
  },
  musicId: {
    type: Sequelize.INTEGER
  },
  voteCount: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  },
  hasPlayed: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
});

module.exports = Room_Music;
