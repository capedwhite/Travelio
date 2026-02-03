import { sequelize } from "../Database/db.js";
import Bargain from "../Model/bargainModel.js";
import { Booking } from "../Model/bookingModel.js";
import { Package } from "../Model/packageModel.js";
import { User } from "../Model/userModel.js";

export const bookpackage = async (req, res) => {
  console.log("booking package api is being called");

  const transaction = await sequelize.transaction();

  try {
    const userId = req.user.id;
    const {
      fullname,
      email,
      phone,
      travelers,
      date,
      packageid,
      selectedCoupon,
      finalPrice,
    } = req.body;

    if (!fullname || !email || !phone || !travelers || !date || !packageid) {
      await transaction.rollback();
      return res.status(400).send({ message: "All fields are required" });
    }

    const pkg = await Package.findOne({
      where: { id: packageid },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    console.log(pkg);
    if (!pkg) {
      await transaction.rollback();
      return res.status(404).send({ message: "Package not found" });
    }

    const max = pkg.availability.maxBookings;
    const current = pkg.availability.currentBookings;
    const remaining = max - current;

    if (travelers > remaining) {
      await transaction.rollback();
      return res.status(400).send({
        message: `Only ${remaining} slots remaining`,
      });
    }

    pkg.availability.currentBookings += Number(travelers);

    await pkg.save({ transaction });

    const basePrice = pkg.price.discountedPrice ?? pkg.price.originalPrice;
    const totalWithoutDiscount = basePrice * Number(travelers);
    const totalWithDiscount = selectedCoupon
      ? finalPrice * Number(travelers)
      : totalWithoutDiscount;

    const priceSnapshot = {
      originalPrice: pkg.price.originalPrice,
      discountedPrice: pkg.price.discountedPrice,
      currency: pkg.price.currency,
      perPerson: true,
      total: totalWithoutDiscount,
      finalTotal: totalWithDiscount,
      couponApplied: selectedCoupon ? true : false,
      couponDiscount: selectedCoupon
        ? totalWithoutDiscount - totalWithDiscount
        : 0,
    };

    // Generate random booking coupon number
    const generateCouponNumber = () => {
      const prefix = "TRAVEL";
      const randomNum = Math.floor(100000 + Math.random() * 900000); // 6-digit random number
      return `${prefix}${randomNum}`;
    };

    const bookingCouponNumber = generateCouponNumber();

    const booking = await Booking.create(
      {
        packageId: packageid,
        Fullname: fullname,
        Email: email,
        Phone: phone,
        Travelers: travelers,
        Date: date,
        userId,
        price: priceSnapshot,
        couponUsed: selectedCoupon || null,
        bookingCoupon: bookingCouponNumber,
      },
      { transaction },
    );

    await transaction.commit();

    res.status(200).send({
      message: "Booking created successfully",
      success: true,
      data: {
        ...booking.toJSON(),
        bookingCoupon: bookingCouponNumber,
      },
      bookingCoupon: bookingCouponNumber,
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

export const bargain = async (req, res) => {
  try {
    const userid = req.user.id;
    const { offerprice, offerdate, notes, packageid } = req.body;
    if (!offerprice || !offerdate || !notes || !packageid) {
      return res.status(500).send({ message: "cannot leave any empty fields" });
    }
    const bargaining = await Bargain.create({
      packageId: packageid,
      offerprice,
      offerdate,
      notes,
      userId: userid,
    });
    res
      .status(200)
      .send({
        data: bargaining,
        message: "sucessfully submitted bargain request",
      });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const getAllbookings = async (req, res) => {
  console.log("api hitting");
  try {
    const getbookings = await Package.findAll({
      include: [
        {
          model: Booking,
          required: true, // Only get packages that have at least one booking
          include: [{ model: User }],
        },
      ],
    });
    console.log(getbookings);
    res
      .status(200)
      .send({ data: getbookings, message: "sucessfully fetched all bookings" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const getallbargains = async (req, res) => {
  console.log("api hit for bargain");
  try {
    const getbargains = await Package.findAll({
      include: [
        {
          model: Bargain,
          required: true, // Only get packages that have at least one bargain
          include: [{ model: User }],
        },
      ],
    });
    console.log(getbargains);
    res
      .status(200)
      .send({ data: getbargains, message: "sucessfully fetched the bargain" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const updateBargainStatus = async (req, res) => {
  try {
    const { bargainId } = req.params;
    const { status } = req.body;

    if (!bargainId || !status) {
      return res
        .status(400)
        .send({ message: "Bargain ID and status are required" });
    }

    if (!["accepted", "declined", "pending"].includes(status.toLowerCase())) {
      return res
        .status(400)
        .send({
          message:
            "Invalid status. Must be 'accepted', 'declined', or 'pending'",
        });
    }

    const bargain = await Bargain.findByPk(bargainId);
    if (!bargain) {
      return res.status(404).send({ message: "Bargain not found" });
    }

    bargain.status = status.toLowerCase();
    await bargain.save();

    res.status(200).send({
      data: bargain,
      message: `Bargain status updated to ${status} successfully`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).send({ message: "User not authenticated" });
    }

    const bookings = await Booking.findAll({
      where: { userId },
      include: [
        {
          model: Package,
          attributes: [
            "id",
            "title",
            "description",
            "price",
            "duration",
            "locations",
            "images",
            "status",
            "isActive",
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).send({
      data: bookings,
      message: "User bookings fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    if (!bookingId || !status) {
      return res
        .status(400)
        .send({ message: "Booking ID and status are required" });
    }

    const validStatuses = ["Not paid", "Paid", "Confirmed", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).send({ message: "Invalid status" });
    }

    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      return res.status(404).send({ message: "Booking not found" });
    }

    booking.status = status;
    await booking.save();

    res.status(200).send({
      data: booking,
      message: "Booking status updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};
