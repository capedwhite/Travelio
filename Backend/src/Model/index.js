import Bargain from "./bargainModel.js";
import { Booking } from "./bookingModel.js";
import { Package } from "./packageModel.js";
import { User } from "./userModel.js";

Package.hasMany(Booking,{foreignKey:"packageId"}) //id=packageid
Package.hasMany(Bargain,{foreignKey:"packageId"})
Bargain.belongsTo(Package,{foreignKey:"packageId"})
Bargain.belongsTo(User,{foreignKey:"id"})
User.belongsTo(Bargain,{foreignKey:"id"})
Booking.belongsTo(Package,{foreignKey:"packageId"})
User.hasMany(Booking,{foreignKey:"id"})
Booking.belongsTo(User, { foreignKey: "id" })