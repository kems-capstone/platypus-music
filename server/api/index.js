const router = require('express').Router();

router.use('/users', require('./users'));
router.use('/rooms', require('./rooms'));
router.use('/music', require('./music'));
module.exports = router;

router.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});
