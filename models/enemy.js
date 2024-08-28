const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Enemy = sequelize.define('Enemy', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  level: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  attackType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  maxHit: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  speed: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  hp: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  attackLevel: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  strengthLevel: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  defenceLevel: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  attackBonus: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  strengthBonus: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  stabDefence: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  slashDefence: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  crushDefence: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Enemy;