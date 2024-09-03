const express = require('express');
const router = express.Router();

router.post('/start-turn', (req, res) => {
  try {
    // decrement player cooldown
    if (req.session.cooldown > 0) {
      req.session.cooldown -= 1;
    }

    res.json({
      success: true,
      cooldown: req.session.cooldown
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
