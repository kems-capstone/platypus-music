// 'use strict';

const db = require('../server/db');
const {
  User,
  User_Rooms,
  Room_Music,
  Room,
  Music
} = require('../server/db/models');
const songs = require('../songs');

async function seed() {
  await db.sync({force: true});
  console.log('db synced!');

  const users = await Promise.all([
    User.create({
      email: 'platy@email.com',
      password: '123',
      firstName: 'patty',
      lastName: 'platypusowitz',
      roomId: 1
    }),
    User.create({
      email: 'okapi@canopyforest.com',
      password: '123',
      firstName: 'cappy',
      lastName: 'okapi'
    }),
    User.create({
      email: 'bear@forest.com',
      password: '123',
      firstName: 'bear',
      lastName: 'bearsmith'
    }),
    User.create({
      email: 'elephant@savanah.com',
      password: '123',
      firstName: 'elle',
      lastName: 'elephante'
    }),
    User.create({
      email: 'panda@schina.com',
      password: '123',
      firstName: 'paul',
      lastName: 'panderson'
    })
  ]);
  console.log(`seeded ${users.length} users`);
  console.log(`seeded successfully`);

  for (let i = 0; i < songs.length; i++) {
    let song = songs[i];

    try {
      const music = await Music.create({
        name: song.name,
        audioUrl: song.audioUrl,
        artist: song.artist,
        album: song.album,
        genre: song.genre,
        artworkUrl: song.artworkUrl
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  const room = await Room.create({
    name: 'marielles jams',
    roomKey: 'AAAA',
    closed: false
  });

  // console.log(Object.keys(Object.getPrototypeOf(room)));
  const amusic = await Music.findByPk(3);
  // console.log(Object.keys(Object.getPrototypeOf(amusic)));
  await amusic.addRoom(room);
}

async function runSeed() {
  console.log('seeding...');
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log('closing db connection');
    await db.close();
    console.log('db connection closed');
  }
}

// // Execute the `seed` function, IF we ran this module directly (`node seed`).
// // `Async` functions always return a promise, so we can use `catch` to handle
// // any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed();
}

// // we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed;
