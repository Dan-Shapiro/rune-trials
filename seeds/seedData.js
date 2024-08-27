const sequelize = require('../config/database');
const Player = require('../models/player');
const Weapon = require('../models/weapon');
const Shield = require('../models/shield');

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

    console.log('Seed data created successfully!');
}

seed().catch(err => {
    console.error('Error seeding data:', err);
}).finally(() => {
    sequelize.close();
});
