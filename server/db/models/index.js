const User = require('./user')
const Room = require('./room')
const Music = require('./music')
const User_Rooms = require('./user_rooms')
const Room_Music = require('./Room_Music')

Room.belongsToMany(User, {through: User_Rooms})
User.belongsToMany(Room, {through: User_Rooms})

Music.belongsToMany(Room, {through: Room_Music})
Room.belongsToMany(Music, {through: Room_Music})

/**
 * If we had any associations to make, this would be a great place to put them!
 * ex. if we had another model called BlogPost, we might say:
 *
 *    BlogPost.belongsTo(User)
 */

/**
 * We'll export all of our models here, so that any time a module needs a model,
 * we can just require it from 'db/models'
 * for example, we can say: const {User} = require('../db/models')
 * instead of: const User = require('../db/models/user')
 */
module.exports = {
  User,
  Room,
  Music,
  User_Rooms,
  Room_Music
}
