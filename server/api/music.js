const router = require('express').Router();
const {Music, Room_Music} = require('../db/models');

router.get('/:song', async (req, res, next) => {
  try {
    let songName = req.params.song.replace(/([a-z])([A-Z])/g, '$1 $2');
    const song = await Music.findOne({
      where: {
        name: songName
      }
    });
    res.json(song);
  } catch (error) {
    next(error);
  }
});

router.put('/:songId/room/:roomId', async (req, res, next) => {
  try {
    const song = await Room_Music.findOne({
      where: {
        roomId: req.params.roomId,
        musicId: req.params.songId
      }
    });
    await song.update({hasPlayed: true});
    res.json(song);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
