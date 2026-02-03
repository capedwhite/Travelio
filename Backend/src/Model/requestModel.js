import { DataTypes } from "sequelize";
import { sequelize } from "../Database/db.js";

export const PackageRequest = sequelize.define("packageRequest", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "users",
      key: "id"
    }
  },
  destination: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  duration: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  travelers: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  budget: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  travelDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  specialRequests: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: "pending"
  },
  packageId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "packages",
      key: "id"
    }
  }
});
