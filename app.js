const express = require('express');
const path = require('path');

const sequelize = require('./config/database');
const {calcMaxHit } = require('./utils/combat');

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
  let maxHit = calcMaxHit(player, weapon, shield);
  res.render('game', { player, weapon, shield, maxHit });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
