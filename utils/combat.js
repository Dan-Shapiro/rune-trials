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
  let eqBonus = 0;
  // players have weapon+shield bonus
  if (weapon) {
    eqBonus += weapon.strengthBonus;
  }
  if (shield) {
    eqBonus += shield.strengthBonus;
  }

  // enemies have built in strength bonus
  if (player.strengthBonus) {
    eqBonus += player.strengthBonus;
  }

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

  // players have weapon+shield bonus
  if (weapon) {
    if (style === 'stab') {
      eqBonus += weapon.stabAttack;
    } else if (style === 'slash') {
      eqBonus += weapon.slashAttack;
    } else if (style === 'crush') {
      eqBonus += weapon.crushAttack;
    }
  }
  if (shield) {
    if (style === 'stab') {
      eqBonus += shield.stabAttack;
    } else if (style === 'slash') {
      eqBonus += shield.slashAttack;
    } else if (style === 'crush') {
      eqBonus += shield.crushAttack;
    }
  }

  // enemies have attack bonus
  if (player.attackBonus) {
    eqBonus += player.attackBonus;
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

  // players have weapon+shield bonus
  if (weapon) {
    if (style === 'stab') {
      eqBonus += weapon.stabDefence;
    } else if (style === 'slash') {
      eqBonus += weapon.slashDefence;
    } else if (style === 'crush') {
      eqBonus += weapon.crushDefence;
    }
  }
  if (shield) {
    if (style === 'stab') {
      eqBonus += shield.stabDefence;
    } else if (style === 'slash') {
      eqBonus += shield.slashDefence;
    } else if (style === 'crush') {
      eqBonus += shield.crushDefence;
    }
  }

  // enemies have defence bonus
  if (style === 'stab') {
    if (player.stabDefence) {
      eqBonus += player.stabDefence;
    }
  } else if (style === 'slash') {
    if (player.slashDefence) {
      eqBonus += player.slashDefence;
    }
  } else if (style === 'crush') {
    if (player.crushDefence) {
      eqBonus += player.crushDefence;
    }
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

function performAttack(attacker, target, weapon, shield, style='stab', stance='accurate', direction) {
  let atkRoll = 0;
  let defRoll = 0;
  if (direction === 'onEnemy') {
    atkRoll = calcAtkRoll(attacker, weapon, shield, style, stance);
    defRoll = calcDefRoll(target, null, null, style, stance);
  } else {
    atkRoll = calcAtkRoll(attacker, null, null, style, stance);
    defRoll = calcDefRoll(target, weapon, shield, style, stance);
  }

  const hitChance = calcHitChance(atkRoll, defRoll);

  if (Math.random() <= hitChance) {
    const maxHit = calcMaxHit(attacker, weapon, shield, stance);
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