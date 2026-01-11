import { DataTypes } from "sequelize";
import { sequelize } from "../Database/db.js";

const Bargain = sequelize.define("bargain",{
bargainId:{
type:DataTypes.INTEGER,
primaryKey:true,
autoIncrement:true,
allowNull:false
},
packageId:{
    type:DataTypes.INTEGER,
    allowNull:false,
    references:{
        model:"packages",
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
offerprice:{
    type:DataTypes.STRING,
    allowNull:false
},
offerdate:{
    type:DataTypes.STRING,
    allowNull:false
},
notes:{
    type:DataTypes.STRING,
    allowNull:false
}
})
export default Bargain