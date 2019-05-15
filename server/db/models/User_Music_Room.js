const Sequelize = require('sequelize');
const db = require('../db');

const User_Music_Room = db.define('user_music_room', {
  userId: {
    type: Sequelize.INTEGER
  },
  roomMusicId: {
    type: Sequelize.INTEGER
  },
  voteValue: {
    type: Sequelize.STRING
  }
});

module.exports = User_Music_Room;
