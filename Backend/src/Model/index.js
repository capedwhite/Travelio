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
import { PackageRequest } from "./requestModel.js";
import Award from "./awardModel.js";
import { Review } from "./reviewModel.js";

Package.hasMany(Booking, { foreignKey: "packageId" });
Package.hasMany(Bargain, { foreignKey: "packageId" });
Bargain.belongsTo(Package, {
  foreignKey: "packageId",
});
Bargain.hasOne(Package, {
  foreignKey: "privatePackageId",
  as: "privatePackage",
});

Package.belongsTo(Bargain, {
  foreignKey: "privatePackageId",
});
PackageRequest.belongsTo(Package, { foreignKey: "packageId", as: "package" });
Package.hasMany(PackageRequest, { foreignKey: "packageId" });

Bargain.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Bargain, { foreignKey: "userId" });
Booking.belongsTo(Package, { foreignKey: "packageId" });
User.hasMany(Booking, { foreignKey: "userId" });
Booking.belongsTo(User, { foreignKey: "userId" });
challenge.hasMany(Submission, { foreignKey: "challengeId" });
Submission.belongsTo(challenge, { foreignKey: "challengeId" });
Submission.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Submission, { foreignKey: "userId" });

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
  otherKey: "followerId",
});

User.belongsToMany(User, {
  through: Follow,
  as: "Following",
  foreignKey: "followerId",
  otherKey: "followingId",
});

User.hasMany(PackageRequest, { foreignKey: "userId" });
PackageRequest.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Award, { foreignKey: "userId" });
Award.belongsTo(User, { foreignKey: "userId" });

challenge.hasMany(Award, { foreignKey: "challengeId" });
Award.belongsTo(challenge, { foreignKey: "challengeId" });

// Review Associations
Package.hasMany(Review, { foreignKey: "packageId" });
Review.belongsTo(Package, { foreignKey: "packageId" });
User.hasMany(Review, { foreignKey: "userId" });
Review.belongsTo(User, { foreignKey: "userId" });
