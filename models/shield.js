const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Shield = sequelize.define('Shield', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  stabAttack: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  slashAttack: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  crushAttack: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  stabDefence: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  slashDefence: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  crushDefence: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  strengthBonus: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Shield;
