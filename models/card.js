const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Card = sequelize.define('Card', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  costModifier: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  function: {
    type: DataTypes.STRING,
    allowNull: true
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  attackType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  weaponStyle: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Card;