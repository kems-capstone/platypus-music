const router = require('express').Router();
const {Music} = require('../db/models');

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

module.exports = router;
