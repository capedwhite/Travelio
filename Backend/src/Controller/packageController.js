import { Sequelize } from "sequelize";
import { Package } from "../Model/packageModel.js";
import { PackageRequest } from "../Model/requestModel.js";
import { User } from "../Model/userModel.js";
import Bargain from "../Model/bargainModel.js";

export const createPackage = async (req, res) => {
  console.log("api hit for create package");
  try {
    const basicInfo = JSON.parse(req.body.basicInfo);
    const pricing = JSON.parse(req.body.pricing);
    const locations = JSON.parse(req.body.locations);
    const hotels = JSON.parse(req.body.hotels);
    const touristSpots = JSON.parse(req.body.touristSpots);
    const itinerary = JSON.parse(req.body.itinerary);
    const availability = JSON.parse(req.body.availability);
    const { bargainId } = req.body;
    const { specificUserId } = req.body;
    const { requestId } = req.body;
    let coverImage = null;
    let touristImages = [];
    req.files.forEach((file) => {
      if (file.fieldname === "coverImage") {
        coverImage = file.path.replace(/\\/g, "/");
      } else if (file.fieldname === "touristImages") {
        touristImages.push(file.path.replace(/\\/g, "/"));
      } else {
        const match = file.fieldname.match(/hotelImages\[(\d+)\]/);
        if (match) {
          const hotelIndex = Number(match[1]);
          if (!hotels[hotelIndex].hotelImages)
            hotels[hotelIndex].hotelImages = [];
          hotels[hotelIndex].hotelImages.push(file.path.replace(/\\/g, "/"));
        }
      }
    });

    const insertPackage = await Package.create({
      title: basicInfo.title,
      description: basicInfo.description,
      duration: basicInfo.duration,

      price: {
        originalPrice: pricing.originalPrice,
        discountedPrice: pricing.discountedPrice,
        currency: pricing.currency,
      },

      locations,
      hotels,

      touristSpots,
      itinerary,

      inclusions: availability.inclusion
        ? availability.inclusion.split("\n")
        : [],

      exclusions: availability.exclusion
        ? availability.exclusion.split("\n")
        : [],

      images: {
        coverImage,
        tourist: touristImages,
      },

      tags: [basicInfo.tag],

      seasonalDiscount: {
        isActive: Boolean(pricing.discountpercentage),
        label: pricing.label || null,
        percentage: Number(pricing.discountpercentage) || 0,
      },

      availability: {
        startDate: availability.startDate,
        endDate: availability.endDate,
        maxBookings: availability.maxBookings,
        currentBookings: 0,
      },

      createdBy: req.user.id,
      visibility: req.body.visibility || "public",
      specificUserId: req.body.specificUserId || null,
    });
    if (bargainId) {
      // Update bargain status and link the created package
      await Bargain.update(
        {
          status: "accepted",
        },
        { where: { bargainId } },
      );
      // Update the package to link it to the bargain
      await insertPackage.update({ privatePackageId: bargainId });
    }
    if (!bargainId && specificUserId && requestId) {
      await PackageRequest.update(
        { packageId: insertPackage.id, status: "processed" },
        { where: { id: requestId, userId: specificUserId } },
      );
    }
    res.status(201).json({
      message: "Successfully inserted vacation package",
      data: insertPackage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getPackage = async (req, res) => {
  try {
    const packages = await Package.findAll();
    console.log(packages);
    res
      .status(200)
      .send({ data: packages, message: "sucessfully fetched all packages" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};
export const getactivePackage = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { filter } = req.query;
    const whereCondition = { status: "Active" };

    if (userId) {
      // Show public packages (not the user's own private ones)
      // User's private packages will be shown in their "My Package Requests" page
      whereCondition.visibility = "public";
    } else {
      whereCondition.visibility = "public";
    }

    // Apply filter conditions
    if (filter && filter !== "All") {
      switch (filter) {
        case "Adventure":
          whereCondition.tags = {
            [Sequelize.Op.contains]: ["Adventure Package"],
          };
          break;
        case "Luxury":
          whereCondition.tags = { [Sequelize.Op.contains]: ["Luxury"] };
          break;
        case "Budget":
          whereCondition.tags = {
            [Sequelize.Op.contains]: ["Budget Friendly"],
          };
          break;
        case "Family":
          whereCondition.tags = {
            [Sequelize.Op.contains]: ["Family Friendly"],
          };
          break;
      }
    }

    const packages = await Package.findAll({
      where: whereCondition,
      order: [["createdAt", "DESC"]],
    });
    console.log(packages);
    res
      .status(200)
      .send({ data: packages, message: "successfully fetched all packages" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};
export const deletePackage = async (req, res) => {
  try {
    console.log("delete api hitting");

    const { id } = req.params;

    const pkg = await Package.findByPk(id);
    if (!pkg) {
      return res.status(404).send({ message: "Package not found" });
    }

    if (pkg.status === "Inactive") {
      return res.status(400).send({ message: "Package already inactive" });
    }

    pkg.status = "Inactive";
    await pkg.save();

    return res.status(200).send({
      message: "Package deleted successfully",
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};
export const updatePackage = async (req, res) => {
  console.log("api hit for update package");
  try {
    const { id } = req.params;

    const pkg = await Package.findByPk(id);
    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }

    const basicInfo = req.body.basicInfo
      ? JSON.parse(req.body.basicInfo)
      : null;
    const pricing = req.body.pricing ? JSON.parse(req.body.pricing) : null;
    const locations = req.body.locations
      ? JSON.parse(req.body.locations)
      : null;
    const hotels = req.body.hotels ? JSON.parse(req.body.hotels) : null;
    const touristSpots = req.body.touristSpots
      ? JSON.parse(req.body.touristSpots)
      : null;
    const itinerary = req.body.itinerary
      ? JSON.parse(req.body.itinerary)
      : null;
    const availability = req.body.availability
      ? JSON.parse(req.body.availability)
      : null;

    let coverImage = null;
    let touristImages = [];
    req.files.forEach((file) => {
      if (file.fieldname === "coverImage") {
        coverImage = file.path.replace(/\\/g, "/");
      } else if (file.fieldname === "touristImages") {
        touristImages.push(file.path.replace(/\\/g, "/"));
      } else {
        const match = file.fieldname.match(/hotelImages\[(\d+)\]/);
        if (match) {
          const hotelIndex = Number(match[1]);
          if (!hotels[hotelIndex].hotelImages)
            hotels[hotelIndex].hotelImages = [];
          hotels[hotelIndex].hotelImages.push(file.path.replace(/\\/g, "/"));
        }
      }
    });

    const updateData = {};

    if (basicInfo) {
      if (basicInfo.title) updateData.title = basicInfo.title;
      if (basicInfo.description) updateData.description = basicInfo.description;
      if (basicInfo.duration) updateData.duration = basicInfo.duration;
      if (basicInfo.tag) updateData.tags = [basicInfo.tag];
    }

    if (pricing) {
      updateData.price = {
        originalPrice: pricing.originalPrice || pkg.price.originalPrice,
        discountedPrice: pricing.discountedPrice || pkg.price.discountedPrice,
        currency: pricing.currency || pkg.price.currency,
      };

      updateData.seasonalDiscount = {
        isActive: Boolean(pricing.discountpercentage),
        label: pricing.label || null,
        percentage: Number(pricing.discountpercentage) || 0,
      };
    }

    if (locations) updateData.locations = locations;

    if (hotels) {
      hotels.forEach((hotel, index) => {
        const existingHotelImages = pkg.hotels[index]?.hotelImages || [];
        const newHotelImages = hotel.hotelImages || [];
        hotel.hotelImages = [...existingHotelImages, ...newHotelImages];
      });
    }
    updateData.hotels = hotels;
    if (touristSpots) updateData.touristSpots = touristSpots;
    if (itinerary) updateData.itinerary = itinerary;

    if (availability) {
      updateData.inclusions = availability.inclusion
        ? availability.inclusion.split("\n")
        : pkg.inclusions;

      updateData.exclusions = availability.exclusion
        ? availability.exclusion.split("\n")
        : pkg.exclusions;

      updateData.availability = {
        startDate: availability.startDate || pkg.availability.startDate,
        endDate: availability.endDate || pkg.availability.endDate,
        maxBookings: availability.maxBookings || pkg.availability.maxBookings,
        currentBookings: pkg.availability.currentBookings,
      };
    }

    updateData.images = {
      coverImage: coverImage || pkg.images.coverImage,
      tourist: [...(pkg.images.tourist || []), ...touristImages],
    };

    await pkg.update(updateData);

    res.status(200).json({
      message: "Package updated successfully",
      data: pkg,
    });
    await pkg.reload();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
export const getPackageByid = async (req, res) => {
  try {
    console.log("getpackage api hiting");
    const { id } = req.params;
    const packages = await Package.findOne({ where: { id: id } });
    console.log("packages are", packages);
    res
      .status(200)
      .send({ data: packages, message: "fetched package by id sucessfully" });
  } catch (error) {
    res.status(500).send({ message: error.messaege });
  }
};

export const createPackageRequest = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).send({ message: "User not authenticated" });
    }

    const {
      destination,
      duration,
      travelers,
      budget,
      travelDate,
      specialRequests,
    } = req.body;

    if (!destination || !duration || !travelers || !budget || !travelDate) {
      return res.status(400).send({ message: "All fields are required" });
    }

    const packageRequest = await PackageRequest.create({
      userId,
      destination,
      duration,
      travelers: Number(travelers),
      budget,
      travelDate,
      specialRequests: specialRequests || null,
    });

    res.status(201).send({
      message:
        "Package request submitted successfully! We'll get back to you soon.",
      data: packageRequest,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

export const getAllPackageRequests = async (req, res) => {
  try {
    const packageRequests = await PackageRequest.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "username", "email", "name", "profileImage"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).send({
      data: packageRequests,
      message: "Package requests fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

export const getUserPackageRequests = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).send({ message: "User not authenticated" });
    }

    const packageRequests = await PackageRequest.findAll({
      where: { userId },
      include: [
        {
          model: Package,
          as: "package",
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).send({
      data: packageRequests,
      message: "User package requests fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

export const getUserBargainRequests = async (req, res) => {
  console.log("api for bargain request of user hit ");
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).send({ message: "User not authenticated" });
    }
    const bargains = await Bargain.findAll({
      where: { userId },
      include: [
        {
          model: Package,
          as: "privatePackage",
          required: false,
        },
        {
          model: Package,
          required: false,
          attributes: [
            "id",
            "title",
            "images",
            "price",
            "locations",
            "duration",
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    console.log(bargains);
    res.status(200).send({
      data: bargains,
      message: "User bargain requests fetched successfully",
    });
  } catch (error) {
    console.error("Bargain fetch error:", error);
    res.status(500).send({ message: error.message });
  }
};

export const updatePackageRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    if (!requestId || !status) {
      return res
        .status(400)
        .send({ message: "Request ID and status are required" });
    }

    if (
      !["pending", "processed", "completed", "cancelled"].includes(
        status.toLowerCase(),
      )
    ) {
      return res.status(400).send({
        message:
          "Invalid status. Must be 'pending', 'processed', 'completed', or 'cancelled'",
      });
    }

    const packageRequest = await PackageRequest.findByPk(requestId);
    if (!packageRequest) {
      return res.status(404).send({ message: "Package request not found" });
    }

    packageRequest.status = status.toLowerCase();
    await packageRequest.save();

    res.status(200).send({
      data: packageRequest,
      message: `Package request status updated to ${status} successfully`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};
