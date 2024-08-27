function calcMaxHit(player, weapon, shield, stance='accurate') {
  let stanceBonus = 1;
  if (stance === 'aggressive') {
    stanceBonus += 2;
  }

  let effStr = player.strengthLevel + stanceBonus + 8;
  let eqBonus = weapon.strengthBonus + shield.strengthBonus + 64;
  return Math.floor((effStr * eqBonus + 320) / 640);
}

module.exports = { calcMaxHit };