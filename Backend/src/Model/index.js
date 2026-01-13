import Bargain from "./bargainModel.js";
import { Booking } from "./bookingModel.js";
import { Package } from "./packageModel.js";
import { User } from "./userModel.js";

Package.hasMany(Booking,{foreignKey:"packageId"}) 
Package.hasMany(Bargain,{foreignKey:"packageId"})
Bargain.belongsTo(Package,{foreignKey:"packageId"})
Bargain.belongsTo(User,{foreignKey:"userId"})
User.belongsTo(Bargain,{foreignKey:"userId"})
Booking.belongsTo(Package,{foreignKey:"packageId"})
User.hasMany(Booking,{foreignKey:"userId"})
Booking.belongsTo(User, { foreignKey: "userId" })