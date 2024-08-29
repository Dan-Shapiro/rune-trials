const express = require('express');
const path = require('path');
const session = require('express-session');

const sequelize = require('./config/database');
const {calcMaxHit, calcCost, performAttack } = require('./utils/combat');
const { shuffleDeck, drawX } = require('./utils/deck');

const Player = require('./models/player');
const Weapon = require('./models/weapon');
const Shield = require('./models/shield');
const Card = require('./models/card');
const Enemy = require('./models/enemy');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  res.locals.capitalizeFirstLetter = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  next();
});

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/game', async (req, res) => {
  req.session.player = await Player.findOne({ where: { name: 'Shappy' } });
  req.session.weapon = await Weapon.findOne({ where: { name: 'Bronze sword' } });
  req.session.shield = await Shield.findOne({ where: { name: 'Wooden shield' } });
  req.session.maxHit = calcMaxHit(req.session.player, req.session.weapon, req.session.shield);
  req.session.essence = 12;
  req.session.hp = req.session.player.hp;

  let deck = [];
  let hand = [];
  let discard = [];
  let exile = [];

  const cards = {
    deck: deck,
    hand: hand,
    discard: discard,
    exile: exile
  }

  cards.deck.push(await Card.findOne({ where: { name: 'Pinpoint Stab' } }));
  cards.deck.push(await Card.findOne({ where: { name: 'Vicious Lunge' } }));
  cards.deck.push(await Card.findOne({ where: { name: 'Savage Slash' } }));
  cards.deck.push(await Card.findOne({ where: { name: 'Guarded Block' } }));

  const enemies = []
  const goblin = await Enemy.findOne({ where: { name: 'Goblin' } });
  const hillGiant = await Enemy.findOne({ where: { name: 'Hill Giant' } });
  enemies.push({
    enemy: goblin,
    hp: goblin.hp
  });
  enemies.push({
    enemy: hillGiant,
    hp: hillGiant.hp
  });

  shuffleDeck(cards.deck);
  const drawn = drawX(cards, 5);

  res.render('game', {
    player: req.session.player,
    weapon: req.session.weapon,
    shield: req.session.shield,
    maxHit: req.session.maxHit,
    essence: req.session.essence,
    hp: req.session.hp,
    cards,
    enemies });
});

app.post('/playCard', async (req, res) => {
  const { cardId, enemyId } = req.body;

  if (!cardId || !enemyId) {
    return res.status(400).json({ success: false, message: 'Card ID or Enemy ID is missing or undefined.' });
  }

  const card = await Card.findOne({ where: { id: cardId } });
  const enemy = await Enemy.findOne({ where: { id: enemyId } });
  const player = req.session.player;
  const weapon = req.session.weapon;
  const shield = req.session.shield;

  const damage = performAttack(player, enemy, weapon, shield, card.attackType, card.weaponStyle);

  let message;
  if (damage > 0) {
    message = `Attack successful! Enemy took ${damage} damage.`;
  } else {
    message = `Attack missed! WOMP WOMP`;
  }

  res.json({
    success: true,
    message: message
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
