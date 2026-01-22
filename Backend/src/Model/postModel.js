import { DataTypes } from "sequelize";
import { sequelize } from "../Database/db.js";

export const Post = sequelize.define("post", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },

  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  image: {
    type: DataTypes.STRING,
    allowNull: true
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "users",
      key: "id"
    }
  },

  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },

  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});
