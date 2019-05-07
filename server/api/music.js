const router = require('express').Router();
const {Music} = require('../db/models');

router.get('/:id', async (req, res, next) => {
  console.log(req.body);
  const song = await Music.findOne({
    where: {
      id: req.params.id
    }
  });
  console.log(song);
  res.json(song);
});

module.exports = router;
