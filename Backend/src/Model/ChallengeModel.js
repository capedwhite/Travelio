import { DataTypes } from "sequelize";
import { sequelize } from "../Database/db";

export const challenge = sequelize.define("challenge", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  
  challengeName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  submissionDeadline: {
    type: DataTypes.DATE,
    allowNull: false
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  award: {
    type: DataTypes.STRING(200),
    allowNull: false
  },

  awardDetail: {
    type: DataTypes.TEXT,
    allowNull: false
  }
})