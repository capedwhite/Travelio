import { DataTypes } from "sequelize";
import { sequelize } from "../Database/db.js";


export const Package = sequelize.define('package', {
  id: {
    type: DataTypes.INTEGER,
       allowNull:false,
        autoIncrement:true,
    primaryKey: true
  },

  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  price: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {
      originalPrice: 0,
      discountedPrice: null,
      currency: 'INR'
    }
  },
  
  duration: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  locations: {
    type: DataTypes.JSONB,
    defaultValue: []
  },

  hotels: {
    type: DataTypes.JSONB,
    defaultValue: [],
    hotels:[]
  },
status:{
  type:DataTypes.STRING,
  defaultValue:"Active"
},
  touristSpots: {
    type: DataTypes.JSONB,
    defaultValue: []
  },


  itinerary: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  
  inclusions: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    defaultValue: []
  },

  exclusions: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    defaultValue: []
  },


  images: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {
      coverImage: '',
      tourist:[],

    }
  },


  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },


  seasonalDiscount: {
    type: DataTypes.JSONB,
    defaultValue: {
      isActive: false,
      label: null,
      percentage: 0
    }
  },

  availability: {
    type: DataTypes.JSONB,
    defaultValue: {
      startDate: null,
      endDate: null,
      maxBookings: 50,
      currentBookings: 0
    }
  },

  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },

  visibility: {
    type: DataTypes.STRING,
    defaultValue: 'public', 
    allowNull: false
  },

  specificUserId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },

  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }

})
