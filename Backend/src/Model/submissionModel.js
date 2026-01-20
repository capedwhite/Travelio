import { DataTypes } from "sequelize";
import { sequelize } from "../Database/db.js";

    export const Submission = sequelize.define("submission", {
        submissionId:{
            type:DataTypes.INTEGER,
            allowNull:false,
            autoIncrement:true,
            primaryKey:true
        },
        challengeId:{
            type:DataTypes.INTEGER,
            allowNull:false,
            references:{
                model:"challenges",
                key:"id"
            }
        },
        userId:{
            type:DataTypes.INTEGER,
            allowNull:false,
            references:{
                model:"users",
                key:"id"
            }
        },
        caption:{
            type:DataTypes.STRING,
            allowNull:true,
        },
        images: {
            type: DataTypes.STRING,
            allowNull: true
          },
        submissionDate:{
            type:DataTypes.DATE,
            allowNull:false,
            defaultValue: DataTypes.NOW
        },
        submissionStatus:{
            type:DataTypes.STRING,
            allowNull:false,
            defaultValue: "pending"
        }
    })