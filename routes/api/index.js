const express = require('express');
const router = express.Router();

const cardRoutes = require('./cards');
const enemyRoutes = require('./enemies');
const playerRoutes = require('./players');
const deckRoutes = require('./deck');

router.use('/cards', cardRoutes);
router.use('/enemies', enemyRoutes);
router.use('/players', playerRoutes);
router.use('/deck', deckRoutes);

module.exports = router;