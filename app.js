const express = require('express');
const path = require('path');
const session = require('express-session');

const sequelize = require('./config/database');

const Player = require('./models/player');
const Weapon = require('./models/weapon');
const Shield = require('./models/shield');
const Card = require('./models/card');
const Enemy = require('./models/enemy');

const apiRoutes = require('./routes/api');
const { initializePlayer } = require('./controllers/playerController');
const { initializeEnemies } = require('./controllers/enemyController');
const { shuffleDeck, drawX } = require('./utils/deck');

// initialize app
const app = express();

// set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middleware setup
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.locals.capitalize = function(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// API routes
app.use('/api', apiRoutes);

// routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/game', async (req, res) => {
  try {
    // initialize player state
    await initializePlayer(req);

    // initialize deck
    let deck = [];
    let hand = [];
    let discard = [];
    const cards = { deck, hand, discard }
    const cardNames = [
      'Pinpoint Stab', 'Piercing Jab', 'Rapid Stab', 'Vicious Lunge', 
      'Lunging Strike', 'Ferocious Lunge', 'Savage Slash', 'Brutal Slash',
      'Cleave', 'Fortified Poke', 'Steel Point', 'Guarded Jab'
    ];

    for (const name of cardNames) {
      const card = await Card.findOne({ where: { name } });
      if (!card) throw new Error(`Card not found: ${name}`);
      cards.deck.push(card);
    }

    req.session.cards = cards;
    shuffleDeck(cards.deck);
    drawX(cards, 5);

    // initialize enemies
    await initializeEnemies(req);

    res.render('game', {
      player: req.session.player,
      weapon: req.session.weapon,
      shield: req.session.shield,
      maxHit: req.session.maxHit,
      cooldown: req.session.cooldown,
      hp: req.session.hp,
      cards: req.session.cards,
      enemies: req.session.enemies
    });
  } catch (error) {
    res.status(500).send('Error initializing game: ' + error.message);
  }
});

// start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
