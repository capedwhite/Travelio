import { Booking } from "../Model/bookingModel.js";
import Bargain from "../Model/bargainModel.js";
import { Package } from "../Model/packageModel.js";
import { User } from "../Model/userModel.js";
import { challenge } from "../Model/ChallengeModel.js";
import { PackageRequest } from "../Model/requestModel.js";
import { Review } from "../Model/reviewModel.js";
import { Op, fn, col, literal } from "sequelize";
import { sequelize } from "../Database/db.js";

const activeUsers = new Map();


const cleanupInactiveUsers = () => {
  const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
  for (const [userId, userData] of activeUsers.entries()) {
    if (userData.lastPing < fiveMinutesAgo) {
      activeUsers.delete(userId);
    }
  }
};

setInterval(cleanupInactiveUsers, 60 * 1000);


export const userHeartbeat = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId, {
      attributes: ["id", "username", "email", "profileImage", "usertype"],
    });

    if (user) {
      activeUsers.set(userId, {
        ...user.toJSON(),
        lastPing: Date.now(),
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get active users
export const getActiveUsers = async (req, res) => {
  try {
    cleanupInactiveUsers();
    const users = Array.from(activeUsers.values()).map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      profileImage: user.profileImage,
      usertype: user.usertype,
      lastActive: new Date(user.lastPing).toISOString(),
    }));

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    // Get total bookings count
    const totalBookings = await Booking.count();

    // Get total revenue from bookings (sum of finalTotal from price JSON)
    const bookings = await Booking.findAll({
      attributes: ["price"],
    });
    const totalRevenue = bookings.reduce((sum, booking) => {
      const price = booking.price;
      return sum + (price?.finalTotal || price?.total || 0);
    }, 0);


    const totalBargains = await Bargain.count();


    const pendingBargains = await Bargain.count({
      where: { status: "Pending" },
    });

    const totalRequests = await PackageRequest.count();


    const pendingRequests = await PackageRequest.count({
      where: { status: "pending" },
    });

    const totalPackages = await Package.count();


    const activePackages = await Package.count({
      where: { status: "Active" },
    });


    const totalChallenges = await challenge.count();

    const activeChallenges = await challenge.count({
      where: { result: "pending" },
    });


    const totalUsers = await User.count();

    const totalReviews = await Review.count();


    const avgRatingResult = await Review.findOne({
      attributes: [[fn("AVG", col("rating")), "avgRating"]],
    });
    const avgRating = parseFloat(
      avgRatingResult?.dataValues?.avgRating || 0,
    ).toFixed(1);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingsToday = await Booking.count({
      where: {
        createdAt: {
          [Op.gte]: today,
        },
      },
    });

    // Get revenue this month
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthlyBookings = await Booking.findAll({
      where: {
        createdAt: {
          [Op.gte]: startOfMonth,
        },
      },
      attributes: ["price"],
    });
    const monthlyRevenue = monthlyBookings.reduce((sum, booking) => {
      const price = booking.price;
      return sum + (price?.finalTotal || price?.total || 0);
    }, 0);

    res.status(200).json({
      success: true,
      data: {
        totalBookings,
        totalRevenue,
        totalBargains,
        pendingBargains,
        totalRequests,
        pendingRequests,
        totalPackages,
        activePackages,
        totalChallenges,
        activeChallenges,
        totalUsers,
        totalReviews,
        avgRating,
        bookingsToday,
        monthlyRevenue,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get booking trends (last 12 months)
export const getBookingTrends = async (req, res) => {
  try {
    const months = [];
    const now = new Date();

    // Get last 12 months of booking data
    for (let i = 11; i >= 0; i--) {
      const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endDate = new Date(
        now.getFullYear(),
        now.getMonth() - i + 1,
        0,
        23,
        59,
        59,
      );

      const count = await Booking.count({
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
        },
      });

      const monthBookings = await Booking.findAll({
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
        },
        attributes: ["price"],
      });

      const revenue = monthBookings.reduce((sum, booking) => {
        const price = booking.price;
        return sum + (price?.finalTotal || price?.total || 0);
      }, 0);

      months.push({
        month: startDate.toLocaleString("default", { month: "short" }),
        year: startDate.getFullYear(),
        bookings: count,
        revenue,
      });
    }

    res.status(200).json({ success: true, data: months });
  } catch (error) {
    console.error("Booking trends error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get recent activity
export const getRecentActivity = async (req, res) => {
  try {
    const limit = 10;


    const recentBookings = await Booking.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["username"],
        },
        {
          model: Package,
          attributes: ["title"],
        },
      ],
    });

    const recentBargains = await Bargain.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["username"],
        },
        {
          model: Package,
          attributes: ["title"],
        },
      ],
    });


    const recentRequests = await PackageRequest.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["username"],
        },
      ],
    });


    const activities = [
      ...recentBookings.map((b) => ({
        type: "booking",
        message: `Booking #${b.bookingId} created by ${b.user?.username || "User"}`,
        package: b.package?.title,
        date: b.createdAt,
        status: b.status,
      })),
      ...recentBargains.map((b) => ({
        type: "bargain",
        message: `Bargain request by ${b.user?.username || "User"}`,
        package: b.package?.title,
        date: b.createdAt,
        status: b.status,
      })),
      ...recentRequests.map((r) => ({
        type: "request",
        message: `Package request for ${r.destination} by ${r.user?.username || "User"}`,
        date: r.createdAt,
        status: r.status,
      })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);

    res.status(200).json({ success: true, data: activities });
  } catch (error) {
    console.error("Recent activity error:", error);
    res.status(500).json({ message: error.message });
  }
};
