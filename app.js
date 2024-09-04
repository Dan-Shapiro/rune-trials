const express = require('express');
const path = require('path');
const session = require('express-session');

const sequelize = require('./config/database');

const Player = require('./models/player');
const Weapon = require('./models/weapon');
const Shield = require('./models/shield');
const Card = require('./models/card');
const Enemy = require('./models/enemy');

const playerController = require('./controllers/playerController');
const enemyController = require('./controllers/enemyController');
const deckController = require('./controllers/deckController');

const apiRoutes = require('./routes/api');
const playRoutes = require('./routes/api/play');
const nextTickRoutes = require('./routes/api/nextTick');

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
app.use('/api', playRoutes);
app.use('/api', nextTickRoutes);

// routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/game', async (req, res) => {
  try {
    // initialize player
    await playerController.initializePlayer(req);

    // initialize deck
    await deckController.initializeDeck(req);

    // shuffle deck
    deckController.shuffle(req.session.cards.deck);

    // initialize enemies
    await enemyController.initializeEnemies(req);

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
