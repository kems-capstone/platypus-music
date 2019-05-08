const router = require('express').Router();
const {Music} = require('../db/models');

router.get('/:id', async (req, res, next) => {

  const song = await Music.findOne({
    where: {
      id: req.params.id
    }
  });

  res.json(song);
});

module.exports = router;
