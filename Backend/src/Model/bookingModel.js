import { DataTypes } from "sequelize";
import { sequelize } from "../Database/db.js";


export const Booking = sequelize.define("booking",{
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:"users",
            key:"id"
        }

    },
    bookingId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true,
        
    },
    packageId:{
        type:DataTypes.INTEGER,
        references:{
            model:"packages",
            key:"id"
        }

    },
    Fullname:{
        type:DataTypes.STRING,
        allowNull:false,

    },
    Email:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
           isEmail:true
        }
    },
    Phone:{
        type:DataTypes.STRING,
        allowNull:false

    },
    Travelers:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    Date:{
        type:DataTypes.DATE,
        allowNull:false
    }, 
    status:{
        type:DataTypes.STRING,
        allowNull:false,
        defaultValue:"Not paid"
        

    },
    price: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {
      originalPrice: 0,
      discountedPrice: null,
      currency: "INR",
    },
},
    couponUsed: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    bookingCoupon: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    }
})