import { jest } from "@jest/globals";

// Mock the Booking model
const mockBooking = {
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
  findOne: jest.fn(),
};

// Mock the Package model
const mockPackage = {
  findOne: jest.fn(),
  findAll: jest.fn(),
};

// Mock the Bargain model
const mockBargain = {
  create: jest.fn(),
  findByPk: jest.fn(),
};

// Mock the User model
const mockUser = {
  findByPk: jest.fn(),
};

// Mock sequelize transaction
const mockTransaction = {
  commit: jest.fn(),
  rollback: jest.fn(),
  LOCK: { UPDATE: "UPDATE" },
};

jest.unstable_mockModule("../Database/db.js", () => ({
  sequelize: {
    transaction: jest.fn().mockResolvedValue(mockTransaction),
  },
}));

jest.unstable_mockModule("../Model/bookingModel.js", () => ({
  Booking: mockBooking,
}));

jest.unstable_mockModule("../Model/packageModel.js", () => ({
  Package: mockPackage,
}));

jest.unstable_mockModule("../Model/bargainModel.js", () => ({
  default: mockBargain,
}));

jest.unstable_mockModule("../Model/userModel.js", () => ({
  User: mockUser,
}));

// Import controller after mocking
const {
  bookpackage,
  bargain,
  getAllbookings,
  getallbargains,
  updateBargainStatus,
  getUserBookings,
  updateBookingStatus,
} = await import("../Controller/bookingController.js");

describe("Booking Controller", () => {
  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("bookpackage", () => {
    it("should create a booking successfully", async () => {
      const req = {
        user: { id: 1 },
        body: {
          fullname: "John Doe",
          email: "john@example.com",
          phone: "1234567890",
          travelers: 2,
          date: "2026-03-15",
          packageid: 1,
          selectedCoupon: null,
          finalPrice: null,
        },
      };
      const res = mockResponse();

      const mockPkg = {
        id: 1,
        availability: { maxBookings: 50, currentBookings: 10 },
        price: { originalPrice: 1000, discountedPrice: 800, currency: "INR" },
        save: jest.fn().mockResolvedValue(true),
      };

      const mockCreatedBooking = {
        bookingId: 1,
        packageId: 1,
        userId: 1,
        Fullname: "John Doe",
        toJSON: jest.fn().mockReturnValue({
          bookingId: 1,
          packageId: 1,
          userId: 1,
          Fullname: "John Doe",
        }),
      };

      mockPackage.findOne.mockResolvedValue(mockPkg);
      mockBooking.create.mockResolvedValue(mockCreatedBooking);

      await bookpackage(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Booking created successfully",
          success: true,
        }),
      );
      expect(mockTransaction.commit).toHaveBeenCalled();
    });

    it("should return 400 if required fields are missing", async () => {
      const req = {
        user: { id: 1 },
        body: {
          fullname: "John Doe",
          email: "john@example.com",
          // missing phone, travelers, date, packageid
        },
      };
      const res = mockResponse();

      await bookpackage(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: "All fields are required",
      });
    });

    it("should return 404 if package not found", async () => {
      const req = {
        user: { id: 1 },
        body: {
          fullname: "John Doe",
          email: "john@example.com",
          phone: "1234567890",
          travelers: 2,
          date: "2026-03-15",
          packageid: 999,
        },
      };
      const res = mockResponse();

      mockPackage.findOne.mockResolvedValue(null);

      await bookpackage(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({ message: "Package not found" });
    });

    it("should return 400 if not enough slots available", async () => {
      const req = {
        user: { id: 1 },
        body: {
          fullname: "John Doe",
          email: "john@example.com",
          phone: "1234567890",
          travelers: 10,
          date: "2026-03-15",
          packageid: 1,
        },
      };
      const res = mockResponse();

      const mockPkg = {
        id: 1,
        availability: { maxBookings: 50, currentBookings: 45 },
        price: { originalPrice: 1000, discountedPrice: 800, currency: "INR" },
      };

      mockPackage.findOne.mockResolvedValue(mockPkg);

      await bookpackage(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: "Only 5 slots remaining",
      });
    });
  });

  describe("bargain", () => {
    it("should create a bargain request successfully", async () => {
      const req = {
        user: { id: 1 },
        body: {
          offerprice: 500,
          offerdate: "2026-04-01",
          notes: "Please consider my offer",
          packageid: 1,
        },
      };
      const res = mockResponse();

      const mockCreatedBargain = {
        id: 1,
        packageId: 1,
        offerprice: 500,
        offerdate: "2026-04-01",
        notes: "Please consider my offer",
        userId: 1,
      };

      mockBargain.create.mockResolvedValue(mockCreatedBargain);

      await bargain(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        data: mockCreatedBargain,
        message: "sucessfully submitted bargain request",
      });
    });

    it("should return 500 if required fields are missing", async () => {
      const req = {
        user: { id: 1 },
        body: {
          offerprice: 500,
          // missing offerdate, notes, packageid
        },
      };
      const res = mockResponse();

      await bargain(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: "cannot leave any empty fields",
      });
    });
  });

  describe("getAllbookings", () => {
    it("should fetch all bookings successfully", async () => {
      const req = {};
      const res = mockResponse();

      const mockBookings = [
        {
          id: 1,
          title: "Package 1",
          bookings: [{ bookingId: 1, Fullname: "John" }],
        },
        {
          id: 2,
          title: "Package 2",
          bookings: [{ bookingId: 2, Fullname: "Jane" }],
        },
      ];

      mockPackage.findAll.mockResolvedValue(mockBookings);

      await getAllbookings(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        data: mockBookings,
        message: "sucessfully fetched all bookings",
      });
    });

    it("should handle errors when fetching bookings", async () => {
      const req = {};
      const res = mockResponse();

      mockPackage.findAll.mockRejectedValue(new Error("Database error"));

      await getAllbookings(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ message: "Database error" });
    });
  });

  describe("getallbargains", () => {
    it("should fetch all bargains successfully", async () => {
      const req = {};
      const res = mockResponse();

      const mockBargains = [
        {
          id: 1,
          title: "Package 1",
          bargains: [{ id: 1, offerprice: 500 }],
        },
      ];

      mockPackage.findAll.mockResolvedValue(mockBargains);

      await getallbargains(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        data: mockBargains,
        message: "sucessfully fetched the bargain",
      });
    });

    it("should handle errors when fetching bargains", async () => {
      const req = {};
      const res = mockResponse();

      mockPackage.findAll.mockRejectedValue(new Error("Database error"));

      await getallbargains(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ message: "Database error" });
    });
  });

  describe("updateBargainStatus", () => {
    it("should update bargain status successfully", async () => {
      const req = {
        params: { bargainId: 1 },
        body: { status: "accepted" },
      };
      const res = mockResponse();

      const mockBargainData = {
        id: 1,
        status: "pending",
        save: jest.fn().mockResolvedValue(true),
      };

      mockBargain.findByPk.mockResolvedValue(mockBargainData);

      await updateBargainStatus(req, res);

      expect(mockBargainData.status).toBe("accepted");
      expect(mockBargainData.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 400 if bargainId or status is missing", async () => {
      const req = {
        params: {},
        body: {},
      };
      const res = mockResponse();

      await updateBargainStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: "Bargain ID and status are required",
      });
    });

    it("should return 400 if status is invalid", async () => {
      const req = {
        params: { bargainId: 1 },
        body: { status: "invalid_status" },
      };
      const res = mockResponse();

      await updateBargainStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: "Invalid status. Must be 'accepted', 'declined', or 'pending'",
      });
    });

    it("should return 404 if bargain not found", async () => {
      const req = {
        params: { bargainId: 999 },
        body: { status: "accepted" },
      };
      const res = mockResponse();

      mockBargain.findByPk.mockResolvedValue(null);

      await updateBargainStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({ message: "Bargain not found" });
    });
  });

  describe("getUserBookings", () => {
    it("should fetch user bookings successfully", async () => {
      const req = { user: { id: 1 } };
      const res = mockResponse();

      const mockUserBookings = [
        {
          bookingId: 1,
          Fullname: "John Doe",
          package: { id: 1, title: "Beach Package" },
        },
        {
          bookingId: 2,
          Fullname: "John Doe",
          package: { id: 2, title: "Mountain Package" },
        },
      ];

      mockBooking.findAll.mockResolvedValue(mockUserBookings);

      await getUserBookings(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        data: mockUserBookings,
        message: "User bookings fetched successfully",
      });
    });

    it("should return 401 if user not authenticated", async () => {
      const req = { user: null };
      const res = mockResponse();

      await getUserBookings(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith({
        message: "User not authenticated",
      });
    });

    it("should handle errors when fetching user bookings", async () => {
      const req = { user: { id: 1 } };
      const res = mockResponse();

      mockBooking.findAll.mockRejectedValue(new Error("Database error"));

      await getUserBookings(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ message: "Database error" });
    });
  });

  describe("updateBookingStatus", () => {
    it("should update booking status successfully", async () => {
      const req = {
        params: { bookingId: 1 },
        body: { status: "Paid" },
      };
      const res = mockResponse();

      const mockBookingData = {
        bookingId: 1,
        status: "Not paid",
        save: jest.fn().mockResolvedValue(true),
      };

      mockBooking.findByPk.mockResolvedValue(mockBookingData);

      await updateBookingStatus(req, res);

      expect(mockBookingData.status).toBe("Paid");
      expect(mockBookingData.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 400 if bookingId or status is missing", async () => {
      const req = {
        params: {},
        body: {},
      };
      const res = mockResponse();

      await updateBookingStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: "Booking ID and status are required",
      });
    });

    it("should return 400 if status is invalid", async () => {
      const req = {
        params: { bookingId: 1 },
        body: { status: "InvalidStatus" },
      };
      const res = mockResponse();

      await updateBookingStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ message: "Invalid status" });
    });

    it("should return 404 if booking not found", async () => {
      const req = {
        params: { bookingId: 999 },
        body: { status: "Paid" },
      };
      const res = mockResponse();

      mockBooking.findByPk.mockResolvedValue(null);

      await updateBookingStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({ message: "Booking not found" });
    });
  });
});
