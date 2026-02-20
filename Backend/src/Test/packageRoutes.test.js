import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";

// Mock the Package model
const mockPackage = {
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
  findOne: jest.fn(),
};

// Mock the User model
const mockUser = {
  findByPk: jest.fn(),
};

// Mock Database connection
jest.unstable_mockModule("../Database/db.js", () => ({
  connection: jest.fn(),
  sequelize: {
    authenticate: jest.fn(),
    sync: jest.fn(),
    define: jest.fn(),
  },
}));

jest.unstable_mockModule("../Model/packageModel.js", () => ({
  Package: mockPackage,
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
const { getactivePackage, getPackageByid } =
  await import("../Controller/packageController.js");

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
  app.get("/user/explorepackages", getactivePackage);
  app.get("/user/explorepackages/:id", getPackageByid);

  return app;
};

describe("Package Routes", () => {
  let app;

  beforeAll(() => {
    app = createTestApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /user/explorepackages", () => {
    it("should return all active packages with status 200", async () => {
      const mockPackages = [
        {
          id: 1,
          title: "Beach Paradise",
          status: "Active",
          visibility: "public",
        },
        {
          id: 2,
          title: "Mountain Adventure",
          status: "Active",
          visibility: "public",
        },
      ];
      mockPackage.findAll.mockResolvedValue(mockPackages);

      const response = await request(app).get("/user/explorepackages");

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockPackages);
      expect(response.body.message).toBe("successfully fetched all packages");
    });

    it("should filter packages by Adventure tag", async () => {
      const mockPackages = [
        {
          id: 1,
          title: "Mountain Trek",
          status: "Active",
          tags: ["Adventure Package"],
        },
      ];
      mockPackage.findAll.mockResolvedValue(mockPackages);

      const response = await request(app)
        .get("/user/explorepackages")
        .query({ filter: "Adventure" });

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockPackages);
    });

    it("should filter packages by Budget tag", async () => {
      const mockPackages = [
        {
          id: 1,
          title: "Budget Trip",
          status: "Active",
          tags: ["Budget Friendly"],
        },
      ];
      mockPackage.findAll.mockResolvedValue(mockPackages);

      const response = await request(app)
        .get("/user/explorepackages")
        .query({ filter: "Budget" });

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockPackages);
    });

    it("should return 500 on database error", async () => {
      mockPackage.findAll.mockRejectedValue(
        new Error("Database connection failed"),
      );

      const response = await request(app).get("/user/explorepackages");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Database connection failed");
    });
  });

  describe("GET /user/explorepackages/:id", () => {
    it("should return a package by id with status 200", async () => {
      const mockPkg = {
        id: 1,
        title: "Beach Paradise",
        description: "A beautiful beach vacation",
        price: {
          originalPrice: 1000,
          discountedPrice: 800,
          currency: "USD",
        },
        status: "Active",
      };
      mockPackage.findOne.mockResolvedValue(mockPkg);

      const response = await request(app).get("/user/explorepackages/1");

      expect(response.status).toBe(200);
      expect(mockPackage.findOne).toHaveBeenCalledWith({ where: { id: "1" } });
      expect(response.body.data).toEqual(mockPkg);
    });

    it("should return 200 with null data if package not found (current behavior)", async () => {
      mockPackage.findOne.mockResolvedValue(null);

      const response = await request(app).get("/user/explorepackages/999");

      expect(response.status).toBe(200);
      expect(response.body.data).toBeNull();
    });

    it("should return 500 on database error", async () => {
      mockPackage.findOne.mockRejectedValue(new Error("Database error"));

      const response = await request(app).get("/user/explorepackages/1");

      expect(response.status).toBe(500);
    });
  });

  describe("Route parameter validation", () => {
    it("should handle string id parameter", async () => {
      const mockPkg = { id: 1, title: "Test Package" };
      mockPackage.findOne.mockResolvedValue(mockPkg);

      const response = await request(app).get("/user/explorepackages/abc");

      expect(mockPackage.findOne).toHaveBeenCalledWith({
        where: { id: "abc" },
      });
    });
  });
});
