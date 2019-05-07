const router = require('express').Router();

router.get('/', (req, res, next) => {
  res.send('This is the api for rooms');
});

module.exports = router;
