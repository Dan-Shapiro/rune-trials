const Enemy = require('../models/enemy');
const { calcMaxHit } = require('../utils/combat');

exports.initializeEnemies = async (req) => {
  try {
    const enemies = [];

    const goblin = await Enemy.findOne({ where: { name: 'Goblin' } });
    if (!goblin) throw new Error('Goblin not found');
    enemies.push({
      enemy: goblin,
      hp: goblin.hp,
      maxHit: calcMaxHit(goblin, null, null, 'crush'),
      cooldown: goblin.speed,
      damageDealt: null
    });

    const hillGiant = await Enemy.findOne({ where: { name: 'Hill Giant' } });
    if (!hillGiant) throw new Error('Hill Giant not found');
    enemies.push({
      enemy: hillGiant,
      hp: hillGiant.hp,
      maxHit: calcMaxHit(hillGiant, null, null, 'crush'),
      cooldown: hillGiant.speed,
      damageDealt: null
    });

    req.session.enemies = enemies;
  } catch (error) {
    console.error('Error initializing enemies:', error.message);
    throw error;
  }
}

exports.getEnemyById = (enemies, enemyId) => {
  return enemies.find(enemy => enemy.enemy.id == enemyId);
};

exports.removeEnemy = (enemies, enemyId) => {
  const enemyIndex = enemies.findIndex(enemy => enemy.enemy.id == enemyId);
  if (enemyIndex > -1) {
    enemies.splice(enemyIndex, 1);
  }
};

exports.takeTurn = (req, res) => {
  res.json({
    status: 'success',
    message: 'Turn taken successfully!'
  });
}