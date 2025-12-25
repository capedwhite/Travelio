import { DataTypes } from "sequelize";
import { sequelize } from "../Database/db.js";

export const User = sequelize.define("users",{
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    username:{
        type:DataTypes.STRING(100),
        allowNull:false,
        unique:true

    },
    email:{
        type:DataTypes.STRING(100),
        allowNull:false,
        unique:true,
        validate:{
           isEmail:true
        }
    },
    password:{
        type:DataTypes.STRING(),
        allowNull:true
    },
    number:{
        type:DataTypes.STRING(100),
        allowNull:false
    },
    googleId:{
        type:DataTypes.STRING(),
        allowNull:true
    }

})