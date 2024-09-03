const Player = require('../models/player');
const Weapon = require('../models/weapon');
const Shield = require('../models/shield');
const { calcMaxHit } = require('../utils/combat');

exports.initializePlayer = async (req) => {
  try {
    const player = await Player.findOne({ where: { name: 'Shappy' } });
    if (!player) throw new Error('Player not found!');

    const weapon = await Weapon.findOne({ where: { name: 'Bronze sword' } });
    if (!weapon) throw new Error('Weapon not found!');

    const shield = await Shield.findOne({ where: { name: 'Wooden shield' } });
    if (!shield) throw new Error('Shield not found!');

    req.session.player = player;
    req.session.weapon = weapon;
    req.session.shield = shield;
    req.session.maxHit = calcMaxHit(player, weapon, shield);
    req.session.cooldown = 0;
    req.session.hp = player.hp;
  } catch (error) {
    console.error('Error initializing player:', error.message);
    throw error;
  }
};