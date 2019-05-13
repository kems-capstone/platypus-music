const router = require('express').Router();
const {Music, Room_Music} = require('../db/models');

router.get('/:id', async (req, res, next) => {
  const song = await Music.findOne({
    where: {
      id: req.params.id
    }
  });

  res.json(song);
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
