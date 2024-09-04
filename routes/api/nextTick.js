const express = require('express');
const router = express.Router();
const combatUtils = require('../../utils/combat');

router.post('/next-tick', (req, res) => {
  try {
    // decrement player cooldown
    if (req.session.cooldown > 0) {
      req.session.cooldown -= 1;
    }

    // enemy turns
    req.session.enemies.forEach(enemyObj => {
      enemyObj.isAttacking = false;
      // decrement enemy cooldown
      enemyObj.cooldown -= 1;
      
      if (enemyObj.cooldown <= 0) {
        // enemy attacks player
        const damage = combatUtils.performAttack(enemyObj.enemy, req.session.player, null, null, enemyObj.enemy.attackType, 'controlled', 'onPlayer');
        enemyObj.damageDealt = damage;
        req.session.hp -= damage;
        enemyObj.playerCurrHp = req.session.hp;
        enemyObj.isAttacking = true;

        // reset enemy cooldown
        enemyObj.cooldown = enemyObj.enemy.speed;
      }
    });

    res.json({
      cooldown: req.session.cooldown,
      hp: req.session.hp,
      maxHp: req.session.player.hp,
      enemies: req.session.enemies.map(enemyObj => ({
        enemy: enemyObj.enemy,
        cooldown: enemyObj.cooldown,
        damage: enemyObj.damageDealt,
        playerCurrHp: enemyObj.playerCurrHp,
        isAttacking: enemyObj.isAttacking
      })),
      isPlayerDefeated: req.session.hp <= 0
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;
