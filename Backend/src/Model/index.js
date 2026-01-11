import { Booking } from "./bookingModel";
import { Package } from "./packageModel";
import { User } from "./userModel";

Package.hasMany(Booking,{foreignKey:"bookingId"})
Booking.belongsTo(Package,{foreignKey:"id"})
Booking.hasMany(User,{foreignKey:"id"})
User.hasMany(Booking,{foreignKey:"id"})
