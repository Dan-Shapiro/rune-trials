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
  const cards = { deck: deck, hand: hand, discard: discard }
  cards.deck.push(await Card.findOne({ where: { name: 'Pinpoint Stab' } }));
  cards.deck.push(await Card.findOne({ where: { name: 'Piercing Jab' } }));
  cards.deck.push(await Card.findOne({ where: { name: 'Rapid Stab' } }));
  cards.deck.push(await Card.findOne({ where: { name: 'Vicious Lunge' } }));
  cards.deck.push(await Card.findOne({ where: { name: 'Lunging Strike' } }));
  cards.deck.push(await Card.findOne({ where: { name: 'Ferocious Lunge' } }));
  cards.deck.push(await Card.findOne({ where: { name: 'Savage Slash' } }));
  cards.deck.push(await Card.findOne({ where: { name: 'Brutal Slash' } }));
  cards.deck.push(await Card.findOne({ where: { name: 'Cleave' } }));
  cards.deck.push(await Card.findOne({ where: { name: 'Fortified Poke' } }));
  cards.deck.push(await Card.findOne({ where: { name: 'Steel Point' } }));
  cards.deck.push(await Card.findOne({ where: { name: 'Guarded Jab' } }));
  req.session.cards = cards;

  const enemies = []
  const goblin = await Enemy.findOne({ where: { name: 'Goblin' } });
  const hillGiant = await Enemy.findOne({ where: { name: 'Hill Giant' } });
  enemies.push({ enemy: goblin, currHp: goblin.hp });
  enemies.push({ enemy: hillGiant, currHp: hillGiant.hp });
  req.session.enemies = enemies;

  shuffleDeck(cards.deck);
  drawX(cards, 5);

  res.render('game', {
    player: req.session.player,
    weapon: req.session.weapon,
    shield: req.session.shield,
    maxHit: req.session.maxHit,
    essence: req.session.essence,
    hp: req.session.hp,
    cards: req.session.cards,
    enemies: req.session.enemies
  });
});

app.post('/playCard', async (req, res) => {
  const { cardId, enemyId } = req.body;

  const card = await Card.findOne({ where: { id: cardId } });
  const player = req.session.player;
  const weapon = req.session.weapon;
  const shield = req.session.shield;
  const enemyData = req.session.enemies.find(e => e.enemy.id === parseInt(enemyId));

  // check if enough essence
  let status = 'success';
  let damage = 0;

  if (card.costModifier + weapon.speed <= req.session.essence) {
    // subtract essence cost
    req.session.essence -= card.costModifier + weapon.speed;

    // deal damage
    damage += performAttack(player, enemyData.enemy, weapon, shield, card.attackType, card.weaponStyle);
    enemyData.currHp = Math.max(0, enemyData.currHp - damage);

    // remove enemy if defeated
    if (enemyData.currHp <= 0) {
      req.session.enemies = req.session.enemies.filter(e => e.enemy.id !== parseInt(enemyId));
    }

    // move card to discard
    const cardIndex = req.session.cards.hand.findIndex(c => c.id === parseInt(cardId));
    if (cardIndex !== -1) {
      req.session.cards.discard.push(req.session.cards.hand.splice(cardIndex, 1)[0]);
    }
  } else {
    status = 'failure';

  }

  res.json({ status: status, damage: damage, currHp: enemyData.currHp, isEnemyDefeated: enemyData.currHp <= 0, essenceCount: req.session.essence });
});

app.post('/endTurn', async (req, res) => {
  // discard hand
  req.session.cards.discard.push(...req.session.cards.hand);
  req.session.cards.hand = [];

  // draw 5 cards
  const newHand = drawX(req.session.cards, 5);
  req.session.cards.hand = newHand;

  // reset essence
  req.session.essence = 12;

  res.json({
    newHand: req.session.cards.hand,
    deckCount: req.session.cards.deck.length,
    discardCount: req.session.cards.discard.length,
    essenceCount: req.session.essence,
    weapon: req.session.weapon
  })
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
