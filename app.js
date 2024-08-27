const express = require('express');
const path = require('path');
const sequelize = require('./config/database');

const Player = require('./models/player');
const Weapon = require('./models/weapon');
const Shield = require('./models/shield');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/game', async (req, res) => {
  const player = await Player.findOne({ where: { name: 'Shappy' } });
  const weapon = await Weapon.findOne({ where: { name: 'Bronze sword' } });
  const shield = await Shield.findOne({ where: { name: 'Wooden shield' } });
  res.render('game', { player, weapon, shield });
});

sequelize.sync({ force: true }).then(async () => {
    await Player.create({
      name: 'Shappy',
      hp: 10,
      attackLevel: 1,
      strengthLevel: 1,
      defenceLevel: 1
    });

    await Weapon.create({
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

    await Shield.create({
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

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
