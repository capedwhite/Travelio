import { DataTypes } from "sequelize";
import { sequelize } from "../Database/db.js";

export const Favorite = sequelize.define("favorite", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "users",
      key: "id",
    },
  },
  packageId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "packages",
      key: "id",
    },
  },
});
