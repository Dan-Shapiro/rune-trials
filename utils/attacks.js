const { performAttack } = require("./combat");


module.exports = {
  accurateStab: (attacker, defender, weapon, shield) => {
    const damage = performAttack(attacker, weapon, shield, 'stab', 'accurate');
    // defender.hp - damage
    return damage
  },
  aggressiveStab: (attacker, defender, weapon, shield) => {
    const damage = performAttack(attacker, weapon, shield, 'stab', 'aggressive');
    // defender.hp - damage
    return damage
  },
  aggressiveSlash: (attacker, defender, weapon, shield) => {
    const damage = performAttack(attacker, weapon, shield, 'slash', 'aggressive');
    // defender.hp - damage
    return damage
  },
  defensiveStab: (attacker, defender, weapon, shield) => {
    const damage = performAttack(attacker, weapon, shield, 'stab', 'defensive');
    // defender.hp - damage
    return damage
  },
};