var express = require('express');
var router = express.Router();
var circleRouter = require('./circle')
var accountTypeRouter = require('./accountType')

router.use('/circles', circleRouter);
router.use('/accountTypes', accountTypeRouter);

module.exports = router;
