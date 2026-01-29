import { DataTypes } from "sequelize";
import { sequelize } from "../Database/db.js";
 // adjust path if needed

const Award = sequelize.define(
  "Award",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },

    challengeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "challenges",
        key: "id",
      },
      onDelete: "CASCADE",
    },

    challengeTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    awardWon: {
      type: DataTypes.ENUM(
        "5 coupons",
        "1 coupon",
        "50% discount",
        "100% discount",
        "10% discount",
        "30% discount"
      ),
      allowNull: false,
    },

    awardDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    awardedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    isUsed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    usedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "awards",
    timestamps: true,
  }
);

export default Award;
