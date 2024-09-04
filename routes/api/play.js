const express = require('express');
const router = express.Router();
const deckController = require('../../controllers/deckController');
const enemyController = require('../../controllers/enemyController');
const combatUtils = require('../../utils/combat');

router.post('/play-card', (req, res) => {
  try {
    const { cardId, enemyId } = req.body;
    const player = req.session.player;
    const card = deckController.getCardById(req.session.cards, cardId);
    const enemy = enemyController.getEnemyById(req.session.enemies, enemyId);
    const weapon = req.session.weapon;
    const shield = req.session.shield;

    // validate card can be played
    if (req.session.cooldown > 0) {
      return res.json({
        success: false,
        message: "You can't play this card right now, your cooldown is still active."
      });
    }

    // calculate card cost and update player cooldown
    let cardCost = card.costModifier;
    if (card.type === 'attack') {
      cardCost += req.session.weapon.speed;
    }
    req.session.cooldown += cardCost;

    let damage = 0;
    // if an attack card
    if (card.type === 'attack') {
      // calculate damage
      damage = combatUtils.performAttack(player, enemy.enemy, weapon, shield, card.attackType, card.weaponStyle, 'onEnemy');
      enemy.hp -= damage;

      // if enemy is defeated, remove it
      if (enemy.hp <= 0) {
        enemyController.removeEnemy(req.session.enemies, enemyId);
      }
    }

    // move card to discard
    deckController.moveCardToDiscard(req.session.cards, cardId);

    res.json({
      success: true,
      newCooldown: req.session.cooldown,
      newEnemyHp: Math.max(enemy.hp, 0),
      enemyMaxHp: enemy.enemy.hp,
      isEnemyDefeated: enemy.hp <= 0,
      damage: damage,
      discardCount: req.session.cards.discard.length,
      message: 'Card played successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;