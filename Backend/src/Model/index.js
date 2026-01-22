import Bargain from "./bargainModel.js";
import { Booking } from "./bookingModel.js";
import { challenge } from "./ChallengeModel.js";
import { Package } from "./packageModel.js";
import { Submission } from "./submissionModel.js";
import { User } from "./userModel.js";
import { Post } from "./postModel.js";
import { Like } from "./Like.js";
import { Comment } from "./Comments.js";
import { Follow } from "./Follow.js";

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

// Social Feed Associations
User.hasMany(Post, { foreignKey: "userId" });
Post.belongsTo(User, { foreignKey: "userId" });

Post.hasMany(Like, { foreignKey: "postId" });
Like.belongsTo(Post, { foreignKey: "postId" });
Like.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Like, { foreignKey: "userId" });

Post.hasMany(Comment, { foreignKey: "postId" });
Comment.belongsTo(Post, { foreignKey: "postId" });
Comment.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Comment, { foreignKey: "userId" });

User.belongsToMany(User, {
  through: Follow,
  as: "Followers",
  foreignKey: "followingId",
  otherKey: "followerId"
});

User.belongsToMany(User, {
  through: Follow,
  as: "Following",
  foreignKey: "followerId",
  otherKey: "followingId"
});
