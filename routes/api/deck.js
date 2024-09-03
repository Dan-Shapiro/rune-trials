const express = require('express');
const router = express.Router();
const deckController = require('../../controllers/deckController');

router.post('/draw', (req, res) => {
  try {
    const { num } = req.body;
    const cardsDrawn = deckController.drawCards(req.session.cards, num);
    res.json({
      cardsDrawn: cardsDrawn,
      deckCount: req.session.cards.deck.length,
      discardCount: req.session.cards.discard.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;