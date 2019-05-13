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
