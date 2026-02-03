import { Favorite } from "../Model/favoriteModel.js";
import { Package } from "../Model/packageModel.js";

// Toggle favorite (add/remove)
export const toggleFavorite = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { packageId } = req.body;

    if (!userId) {
      return res.status(401).send({ message: "User not authenticated" });
    }

    if (!packageId) {
      return res.status(400).send({ message: "Package ID is required" });
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({
      where: { userId, packageId },
    });

    if (existingFavorite) {
      // Remove from favorites
      await existingFavorite.destroy();
      return res.status(200).send({
        message: "Removed from favorites",
        isFavorited: false,
      });
    } else {
      // Add to favorites
      await Favorite.create({ userId, packageId });
      return res.status(201).send({
        message: "Added to favorites",
        isFavorited: true,
      });
    }
  } catch (error) {
    console.error("Toggle favorite error:", error);
    res.status(500).send({ message: error.message });
  }
};

// Get user's favorites
export const getUserFavorites = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).send({ message: "User not authenticated" });
    }

    const favorites = await Favorite.findAll({
      where: { userId },
      include: [
        {
          model: Package,
          where: { status: "Active" },
          required: true,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).send({
      data: favorites,
      message: "Favorites fetched successfully",
    });
  } catch (error) {
    console.error("Get favorites error:", error);
    res.status(500).send({ message: error.message });
  }
};

// Get user's favorite package IDs (for checking if packages are favorited)
export const getUserFavoriteIds = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).send({ message: "User not authenticated" });
    }

    const favorites = await Favorite.findAll({
      where: { userId },
      attributes: ["packageId"],
    });

    const favoriteIds = favorites.map((fav) => fav.packageId);

    res.status(200).send({
      data: favoriteIds,
      message: "Favorite IDs fetched successfully",
    });
  } catch (error) {
    console.error("Get favorite IDs error:", error);
    res.status(500).send({ message: error.message });
  }
};
