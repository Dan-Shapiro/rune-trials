const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Player = sequelize.define('Player', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  hp: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  attackLevel: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  strengthLevel: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  defenceLevel: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  }
});

module.exports = Player;