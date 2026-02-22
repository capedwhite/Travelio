import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";

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

// Mock Database connection
jest.unstable_mockModule("../Database/db.js", () => ({
  connection: jest.fn(),
  sequelize: {
    authenticate: jest.fn(),
    sync: jest.fn(),
    define: jest.fn(),
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

// Mock the auth middleware to bypass authentication
jest.unstable_mockModule("../Middleware/authmiddleware.js", () => ({
  protect: (req, res, next) => {
    req.user = { id: 1, role: "user" };
    next();
  },
}));

// Import after mocking
const { bookpackage, bargain, getUserBookings } =
  await import("../Controller/bookingController.js");

// Create a test app
const createTestApp = () => {
  const app = express();
  app.use(express.json());

  // Mock protect middleware for testing
  app.use((req, res, next) => {
    req.user = { id: 1, role: "user" };
    next();
  });

  // Define routes matching userRoutes.js
  app.post("/user/explorepackages/booking", bookpackage);
  app.post("/user/explorepackages/bargain", bargain);
  app.get("/user/mybookings", getUserBookings);

  return app;
};

describe("Booking Routes", () => {
  let app;

  beforeAll(() => {
    app = createTestApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockTransaction.commit.mockClear();
    mockTransaction.rollback.mockClear();
  });

  describe("POST /user/explorepackages/booking", () => {
    it("should create a booking with status 200", async () => {
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

      const response = await request(app)
        .post("/user/explorepackages/booking")
        .send({
          fullname: "John Doe",
          email: "john@example.com",
          phone: "1234567890",
          travelers: 2,
          date: "2026-03-15",
          packageid: 1,
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Booking created successfully");
      expect(response.body.success).toBe(true);
    });

    it("should return 400 if required fields are missing", async () => {
      const response = await request(app)
        .post("/user/explorepackages/booking")
        .send({
          fullname: "John Doe",
          email: "john@example.com",
          // missing phone, travelers, date, packageid
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("All fields are required");
    });

    it("should return 404 if package not found", async () => {
      mockPackage.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post("/user/explorepackages/booking")
        .send({
          fullname: "John Doe",
          email: "john@example.com",
          phone: "1234567890",
          travelers: 2,
          date: "2026-03-15",
          packageid: 999,
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Package not found");
    });

    it("should return 400 if not enough slots available", async () => {
      const mockPkg = {
        id: 1,
        availability: { maxBookings: 50, currentBookings: 48 },
        price: { originalPrice: 1000, discountedPrice: 800, currency: "INR" },
      };

      mockPackage.findOne.mockResolvedValue(mockPkg);

      const response = await request(app)
        .post("/user/explorepackages/booking")
        .send({
          fullname: "John Doe",
          email: "john@example.com",
          phone: "1234567890",
          travelers: 5,
          date: "2026-03-15",
          packageid: 1,
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Only 2 slots remaining");
    });
  });

  describe("POST /user/explorepackages/bargain", () => {
    it("should create a bargain request with status 200", async () => {
      const mockCreatedBargain = {
        id: 1,
        packageId: 1,
        offerprice: 500,
        offerdate: "2026-04-01",
        notes: "Please consider my offer",
        userId: 1,
      };

      mockBargain.create.mockResolvedValue(mockCreatedBargain);

      const response = await request(app)
        .post("/user/explorepackages/bargain")
        .send({
          offerprice: 500,
          offerdate: "2026-04-01",
          notes: "Please consider my offer",
          packageid: 1,
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        "sucessfully submitted bargain request",
      );
      expect(response.body.data).toEqual(mockCreatedBargain);
    });

    it("should return 500 if required fields are missing", async () => {
      const response = await request(app)
        .post("/user/explorepackages/bargain")
        .send({
          offerprice: 500,
          // missing offerdate, notes, packageid
        });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("cannot leave any empty fields");
    });

    it("should return 500 on database error", async () => {
      mockBargain.create.mockRejectedValue(new Error("Database error"));

      const response = await request(app)
        .post("/user/explorepackages/bargain")
        .send({
          offerprice: 500,
          offerdate: "2026-04-01",
          notes: "Please consider my offer",
          packageid: 1,
        });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Database error");
    });
  });

  describe("GET /user/mybookings", () => {
    it("should return user bookings with status 200", async () => {
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

      const response = await request(app).get("/user/mybookings");

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockUserBookings);
      expect(response.body.message).toBe("User bookings fetched successfully");
    });

    it("should return empty array if user has no bookings", async () => {
      mockBooking.findAll.mockResolvedValue([]);

      const response = await request(app).get("/user/mybookings");

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
    });

    it("should return 500 on database error", async () => {
      mockBooking.findAll.mockRejectedValue(
        new Error("Database connection failed"),
      );

      const response = await request(app).get("/user/mybookings");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Database connection failed");
    });
  });

  describe("Route validation", () => {
    it("should handle invalid JSON body", async () => {
      const response = await request(app)
        .post("/user/explorepackages/booking")
        .set("Content-Type", "application/json")
        .send("invalid json");

      expect(response.status).toBe(400);
    });

    it("should require authentication context (mocked)", async () => {
      // This test verifies the middleware sets user context
      const response = await request(app).get("/user/mybookings");

      // Should not return 401 because we mocked the auth middleware
      expect(response.status).not.toBe(401);
    });
  });
});
