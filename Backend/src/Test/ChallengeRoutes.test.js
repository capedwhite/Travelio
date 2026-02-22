import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";

// Mock the Challenge model
const mockChallenge = {
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
  findOne: jest.fn(),
};

// Mock the Submission model
const mockSubmission = {
  create: jest.fn(),
  findOne: jest.fn(),
  findAll: jest.fn(),
  count: jest.fn(),
};

// Mock the User model
const mockUser = {
  findByPk: jest.fn(),
  findAll: jest.fn(),
};

// Mock the Award model
const mockAward = {
  create: jest.fn(),
};

// Mock Database connection
jest.unstable_mockModule("../Database/db.js", () => ({
  connection: jest.fn(),
  sequelize: {
    authenticate: jest.fn(),
    sync: jest.fn(),
    define: jest.fn(),
    transaction: jest.fn(),
  },
}));

jest.unstable_mockModule("../Model/ChallengeModel.js", () => ({
  challenge: mockChallenge,
}));

jest.unstable_mockModule("../Model/submissionModel.js", () => ({
  Submission: mockSubmission,
}));

jest.unstable_mockModule("../Model/userModel.js", () => ({
  User: mockUser,
}));

jest.unstable_mockModule("../Model/awardModel.js", () => ({
  default: mockAward,
}));

// Mock the auth middleware to bypass authentication
jest.unstable_mockModule("../Middleware/authmiddleware.js", () => ({
  protect: (req, res, next) => {
    req.user = { id: 1, role: "user" };
    next();
  },
}));

// Mock multer
jest.unstable_mockModule("../Config/multer.js", () => ({
  default: {
    single: () => (req, res, next) => next(),
    any: () => (req, res, next) => {
      req.files = [];
      next();
    },
  },
}));

// Import after mocking
const { getAllChallenges, getChallengeById, submitChallenge, getTopChallengeUsers } =
  await import("../Controller/ChallengeController.js");

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
  app.get("/user/getchallenges", getAllChallenges);
  app.get("/user/getchallenges/:id", getChallengeById);
  app.post("/user/getchallenges/:id", submitChallenge);
  app.get("/user/gettopusers", getTopChallengeUsers);

  return app;
};

describe("Challenge Routes", () => {
  let app;

  beforeAll(() => {
    app = createTestApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /user/getchallenges", () => {
    it("should get all challenges with status 200", async () => {
      const mockChallenges = [
        {
          id: 1,
          challengeName: "Photo Challenge",
          description: "Best photo wins",
          award: "Free Trip",
          submissions: [],
          toJSON: jest.fn().mockReturnValue({
            id: 1,
            challengeName: "Photo Challenge",
            description: "Best photo wins",
            award: "Free Trip",
            submissions: [],
          }),
        },
      ];

      mockChallenge.findAll.mockResolvedValue(mockChallenges);

      const response = await request(app).get("/user/getchallenges");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Successfully fetched challenges");
      expect(response.body.data).toBeDefined();
    });

    it("should return empty array when no challenges exist", async () => {
      mockChallenge.findAll.mockResolvedValue([]);

      const response = await request(app).get("/user/getchallenges");

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
    });
  });

  describe("GET /user/getchallenges/:id", () => {
    it("should get a challenge by id with status 200", async () => {
      const mockChallengeData = {
        id: 1,
        challengeName: "Photo Challenge",
        description: "Best photo wins",
        award: "Free Trip",
        result: "pending",
        winnerId: null,
        submissions: [],
        toJSON: jest.fn().mockReturnValue({
          id: 1,
          challengeName: "Photo Challenge",
          description: "Best photo wins",
          award: "Free Trip",
          result: "pending",
          winnerId: null,
          submissions: [],
        }),
      };

      mockChallenge.findByPk.mockResolvedValue(mockChallengeData);

      const response = await request(app).get("/user/getchallenges/1");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Challenge fetched successfully");
    });

    it("should return 404 if challenge not found", async () => {
      mockChallenge.findByPk.mockResolvedValue(null);

      const response = await request(app).get("/user/getchallenges/999");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Challenge not found");
    });
  });

  describe("POST /user/getchallenges/:id", () => {
    it("should submit to a challenge with status 201", async () => {
      const mockChallengeData = {
        id: 1,
        challengeName: "Photo Challenge",
      };

      const mockCreatedSubmission = {
        submissionId: 1,
        challengeId: 1,
        userId: 1,
        caption: "My photo!",
        images: [],
      };

      mockChallenge.findByPk.mockResolvedValue(mockChallengeData);
      mockSubmission.findOne.mockResolvedValue(null);
      mockSubmission.create.mockResolvedValue(mockCreatedSubmission);

      const response = await request(app)
        .post("/user/getchallenges/1")
        .send({ caption: "My photo!" });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Challenge submitted successfully");
    });

    it("should return 404 if challenge not found", async () => {
      mockChallenge.findByPk.mockResolvedValue(null);

      const response = await request(app)
        .post("/user/getchallenges/999")
        .send({ caption: "Test" });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Challenge not found");
    });

    it("should return 400 if user already submitted", async () => {
      mockChallenge.findByPk.mockResolvedValue({ id: 1 });
      mockSubmission.findOne.mockResolvedValue({
        submissionId: 1,
        userId: 1,
        challengeId: 1,
      });

      const response = await request(app)
        .post("/user/getchallenges/1")
        .send({ caption: "Test" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("You have already submitted your challenge");
    });
  });

  describe("GET /user/gettopusers", () => {
    it("should get top users with status 200", async () => {
      const mockTopUsers = [
        { id: 1, username: "topuser1", submissionCount: 10 },
        { id: 2, username: "topuser2", submissionCount: 8 },
      ];

      mockUser.findAll.mockResolvedValue(mockTopUsers);

      const response = await request(app).get("/user/gettopusers");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Global leaderboard fetched successfully");
      expect(response.body.data).toBeDefined();
    });

    it("should return empty leaderboard when no users", async () => {
      mockUser.findAll.mockResolvedValue([]);

      const response = await request(app).get("/user/gettopusers");

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
    });
  });
});
