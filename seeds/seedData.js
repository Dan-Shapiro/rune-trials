const sequelize = require('../config/database');
const Player = require('../models/player');
const Weapon = require('../models/weapon');
const Shield = require('../models/shield');
const Card = require('../models/card');
const Enemy = require('../models/enemy');

async function seed() {
    await sequelize.sync({ force: true });

    const player = await Player.create({
      name: 'Shappy',
      strengthLevel: 50,
      attackLevel: 50,
      defenceLevel: 50,
      hp: 50
    });

    const weapon = await Weapon.create({
      name: 'Bronze sword',
      slot: 'main-hand',
      speed: 4,
      stabAttack: 4,
      slashAttack: 3,
      crushAttack: -2,
      stabDefence: 0,
      slashDefence: 2,
      crushDefence: 1,
      strengthBonus: 5,
      combatStyles: [
        { attackType: 'stab', weaponStyle: 'accurate', icon: '/icons/main/stab-attack.png' },
        { attackType: 'stab', weaponStyle: 'aggressive', icon: '/icons/main/lunge-attack.png' },
        { attackType: 'slash', weaponStyle: 'aggressive', icon: '/icons/main/slash-attack.png' },
        { attackType: 'stab', weaponStyle: 'defensive', icon: '/icons/main/block-attack.png' }
      ],
      icon: 'bronze-sword.png'
    });

    const shield = await Shield.create({
      name: 'Wooden shield',
      stabAttack: 0,
      slashAttack: 0,
      crushAttack: 0,
      stabDefence: 4,
      slashDefence: 5,
      crushDefence: 3,
      strengthBonus: 0,
      icon: 'wooden-shield.png'
    });

    const pinpointStab = await Card.create({
      name: 'Pinpoint Stab',
      costModifier: 0,
      text: 'A precise stab with enhanced accuracy.',
      image: '/icons/attacks/stab.png',
      function: 'accurateStab',
      type: 'attack',
      attackType: 'stab',
      weaponStyle: 'accurate'
    });
  
    const viciousLunge = await Card.create({
      name: 'Vicious Lunge',
      costModifier: 1,
      text: 'A forceful lunge that sacrifices accuracy for increased damage.',
      image: '/icons/attacks/lunge.png',
      function: 'aggressiveStab',
      type: 'attack',
      attackType: 'stab',
      weaponStyle: 'aggressive'
    });
  
    const savageSlash = await Card.create({
      name: 'Savage Slash',
      costModifier: 2,
      text: 'A powerful slash attack with a reckless approach.',
      image: '/icons/attacks/slash.png',
      function: 'aggressiveSlash',
      type: 'attack',
      attackType: 'slash',
      weaponStyle: 'aggressive'
    });
  
    const guardedBlock = await Card.create({
      name: 'Guarded Block',
      costModifier: 0,
      text: 'A cautious block that balances offense and defence.',
      image: '/icons/attacks/block.png',
      function: 'defensiveStab',
      type: 'attack',
      attackType: 'stab',
      weaponStyle: 'defensive'
    });

    const goblin = await Enemy.create({
      name: 'Goblin',
      level: 2,
      attackType: 'crush',
      maxHit: 1,
      speed: 4,
      hp: 5,
      attackLevel: 1,
      strengthLevel: 1,
      defenceLevel: 1,
      attackBonus: -21,
      strengthBonus: -15,
      stabDefence: -15,
      slashDefence: -15,
      crushDefence: -15,
      image: '/icons/enemies/goblin.png'
    });

    const hillGiant = await Enemy.create({
      name: 'Hill Giant',
      level: 28,
      attackType: 'crush',
      maxHit: 4,
      speed: 6,
      hp: 35,
      attackLevel: 18,
      strengthLevel: 22,
      defenceLevel: 26,
      attackBonus: 18,
      strengthBonus: 16,
      stabDefence: 0,
      slashDefence: 0,
      crushDefence: 0,
      image: '/icons/enemies/hill-giant.png'
    });

    console.log('Seed data created successfully!');
}

seed().catch(err => {
    console.error('Error seeding data:', err);
}).finally(() => {
    sequelize.close();
});
