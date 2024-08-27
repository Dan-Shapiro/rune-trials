const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { name } = require('ejs');

const Weapon = sequelize.define('Weapon', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slot: {
    type: DataTypes.STRING,
    allowNull: false
  },
  speed: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  stabAttack: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  slashAttack: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  crushAttack: {
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
  strengthBonus: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  combatStyles: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Weapon;