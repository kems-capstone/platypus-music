const router = require('express').Router();
const {Music, Room_Music} = require('../db/models');

router.get('/:song', async (req, res, next) => {
  try {
    let songName = decodeURI(req.params.song);
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

router.delete('/:musicId/room/:roomId', async (req, res, next) => {
  try {
    await Room_Music.destroy({
      where: {
        musicId: req.params.musicId,
        roomId: req.params.roomId
      }
    });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
