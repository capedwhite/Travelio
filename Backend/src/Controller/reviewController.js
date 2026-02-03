import { Review } from "../Model/reviewModel.js";
import { User } from "../Model/userModel.js";
import { Package } from "../Model/packageModel.js";

// Get all reviews for a specific package
export const getPackageReviews = async (req, res) => {
  try {
    const { packageId } = req.params;

    const reviews = await Review.findAll({
      where: { packageId },
      include: [
        {
          model: User,
          attributes: ["id", "username", "profileImage"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating =
      reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

    res.status(200).send({
      data: reviews,
      averageRating: parseFloat(averageRating),
      totalReviews: reviews.length,
      message: "Reviews fetched successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

// Add a review for a package
export const addReview = async (req, res) => {
  try {
    const { packageId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).send({ message: "User not authenticated" });
    }

    if (!rating || !comment) {
      return res
        .status(400)
        .send({ message: "Rating and comment are required" });
    }

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .send({ message: "Rating must be between 1 and 5" });
    }

    // Check if package exists
    const pkg = await Package.findByPk(packageId);
    if (!pkg) {
      return res.status(404).send({ message: "Package not found" });
    }

    // Check if user already reviewed this package
    const existingReview = await Review.findOne({
      where: { packageId, userId },
    });

    if (existingReview) {
      return res
        .status(400)
        .send({ message: "You have already reviewed this package" });
    }

    const review = await Review.create({
      packageId,
      userId,
      rating,
      comment,
    });

    // Fetch the review with user details
    const reviewWithUser = await Review.findByPk(review.id, {
      include: [
        {
          model: User,
          attributes: ["id", "username", "profileImage"],
        },
      ],
    });

    res.status(201).send({
      data: reviewWithUser,
      message: "Review added successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

// Delete a review (only by owner)
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).send({ message: "User not authenticated" });
    }

    const review = await Review.findOne({
      where: { id: reviewId, userId },
    });

    if (!review) {
      return res
        .status(404)
        .send({
          message: "Review not found or you don't have permission to delete it",
        });
    }

    await review.destroy();

    res.status(200).send({ message: "Review deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};
