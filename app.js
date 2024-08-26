const express = require('express');
const path = require('path');
const sequelize = require('./config/database');
const Player = require('./models/player');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  const player = await Player.findOne({ where: { name: 'Shappy' } });
  res.render('index', { player });
});

sequelize.sync({ force: true }).then(async () => {
    await Player.create({
      name: 'Shappy',
      hp: 10,
      attackLevel: 1,
      strengthLevel: 1,
      defenceLevel: 1
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
