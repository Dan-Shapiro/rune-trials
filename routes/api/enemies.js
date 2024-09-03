const express = require('express');
const router = express.Router();
const enemyController = require('../../controllers/enemyController');

router.post('/takeTurn', enemyController.takeTurn);

module.exports = router;