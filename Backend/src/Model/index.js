import Bargain from "./bargainModel.js";
import { Booking } from "./bookingModel.js";
import { challenge } from "./ChallengeModel.js";
import { Package } from "./packageModel.js";
import { Submission } from "./submissionModel.js";
import { User } from "./userModel.js";

Package.hasMany(Booking,{foreignKey:"packageId"}) 
Package.hasMany(Bargain,{foreignKey:"packageId"})
Bargain.belongsTo(Package,{foreignKey:"packageId"})
Bargain.belongsTo(User,{foreignKey:"userId"})
User.belongsTo(Bargain,{foreignKey:"userId"})
Booking.belongsTo(Package,{foreignKey:"packageId"})
User.hasMany(Booking,{foreignKey:"userId"})
Booking.belongsTo(User, { foreignKey: "userId" })
challenge.hasMany(Submission,{foreignKey:"challengeId"})
Submission.belongsTo(challenge,{foreignKey:"challengeId"})
Submission.belongsTo(User,{foreignKey:"userId"})
User.hasMany(Submission,{foreignKey:"userId"})
