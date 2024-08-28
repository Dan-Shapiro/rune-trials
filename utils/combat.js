const Player = require('../models/player');
const Weapon = require('../models/weapon');
const Shield = require('../models/shield');

function calcMaxHit(player, weapon, shield, stance='accurate') {
  let stanceBonus = 0;
  if (stance === 'aggressive') {
    stanceBonus += 3;
  } else if (stance === 'controlled') {
    stanceBonus += 1;
  }

  let effStr = player.strengthLevel + stanceBonus + 8;
  let eqBonus = weapon.strengthBonus + shield.strengthBonus || 0;
  return Math.floor((effStr * (eqBonus + 64) + 320) / 640);
}

function calcAtkRoll(player, weapon, shield, style='stab', stance='accurate') {
  let stanceBonus = 0;
  if (stance === 'accurate') {
    stanceBonus += 3;
  } else if (stance === 'controlled') {
    stanceBonus += 1;
  }

  let effAtk = player.attackLevel + stanceBonus + 8
  let eqBonus = 0;
  if (style === 'stab') {
    eqBonus += weapon.stabAttack + shield.stabAttack || 0;
  } else if (style === 'slash') {
    eqBonus += weapon.slashAttack + shield.slashAttack || 0;
  } else if (style === 'crush') {
    eqBonus += weapon.crushAttack + shield.crushAttack || 0;
  }

  return effAtk * (eqBonus + 64);
}

function calcDefRoll(player, weapon, shield, style='stab', stance='accurate') {
  let stanceBonus = 0;
  if (stance === 'defensive') {
    stanceBonus += 3;
  } else if (stance === 'controlled') {
    stanceBonus += 1;
  }

  let effDef = player.defenceLevel + stanceBonus + 8
  let eqBonus = 0;
  if (style === 'stab') {
    eqBonus += weapon.stabDefence + shield.stabDefence || 0;
  } else if (style === 'slash') {
    eqBonus += weapon.slashDefence + shield.slashDefence || 0;
  } else if (style === 'crush') {
    eqBonus += weapon.crushDefence + shield.crushDefence || 0;
  }

  return effDef * (eqBonus + 64);
}

function calcHitChance(atkRoll, defRoll) {
  let hitChance = 0;
  if (atkRoll > defRoll) {
    hitChance = 1 - ((defRoll + 2) / (2 * (atkRoll + 1)));
  } else {
    hitChance = (atkRoll) / (2 * (defRoll + 1));
  }

  return hitChance;
}

function calcDamage(maxHit) {
  return Math.floor(Math.random() * maxHit) + 1;
}

function performAttack(player, weapon, shield, style='stab', stance='accurate') {
  const atkRoll = calcAtkRoll(player, weapon, shield, style, stance);
  const defRoll = 0 // to do
  const hitChance = calcHitChance(atkRoll, defRoll);

  if (Math.random() <= hitChance) {
    const maxHit = calcMaxHit(player, weapon, shield, stance);
    const damage = calcDamage(maxHit);
    return damage;
  } else {
    return 0;
  }
}

function calcCost(card, weapon) {
  const baseCost = weapon.speed;
  const essenceCost = baseCost + card.costModifier;
  return essenceCost > 0 ? essenceCost : 0;
}

module.exports = { calcMaxHit, calcCost, performAttack };