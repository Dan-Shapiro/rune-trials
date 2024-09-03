const express = require('express');
const router = express.Router();
const cardController = require('../../controllers/cardController');

router.post('/play', cardController.playCard)

module.exports = router;