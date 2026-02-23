import { jest } from "@jest/globals";

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
  sequelize: {
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

// Import controller after mocking
const {
  getAllChallenges,
  getChallengeById,
  submitChallenge,
  getTopChallengeUsers,
} = await import("../Controller/ChallengeController.js");

describe("Challenge Controller", () => {
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

  describe("getAllChallenges", () => {
    it("should fetch all challenges successfully", async () => {
      const req = {
        user: { id: 1 },
      };
      const res = mockResponse();

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
        {
          id: 2,
          challengeName: "Video Challenge",
          description: "Best video wins",
          award: "Camera",
          submissions: [{ userId: 1 }],
          toJSON: jest.fn().mockReturnValue({
            id: 2,
            challengeName: "Video Challenge",
            description: "Best video wins",
            award: "Camera",
            submissions: [{ userId: 1 }],
          }),
        },
      ];

      mockChallenge.findAll.mockResolvedValue(mockChallenges);

      await getAllChallenges(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Successfully fetched challenges",
        }),
      );
    });

    it("should mark hasSubmitted correctly for user", async () => {
      const req = {
        user: { id: 1 },
      };
      const res = mockResponse();

      const mockChallenges = [
        {
          id: 1,
          challengeName: "Challenge 1",
          submissions: [{ userId: 1 }],
          toJSON: jest.fn().mockReturnValue({
            id: 1,
            challengeName: "Challenge 1",
            submissions: [{ userId: 1 }],
          }),
        },
      ];

      mockChallenge.findAll.mockResolvedValue(mockChallenges);

      await getAllChallenges(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = res.send.mock.calls[0][0].data;
      expect(responseData[0].hasSubmitted).toBe(true);
    });

    it("should handle challenges fetch without authenticated user", async () => {
      const req = {
        user: null,
      };
      const res = mockResponse();

      const mockChallenges = [
        {
          id: 1,
          challengeName: "Public Challenge",
          submissions: [],
          toJSON: jest.fn().mockReturnValue({
            id: 1,
            challengeName: "Public Challenge",
            submissions: [],
          }),
        },
      ];

      mockChallenge.findAll.mockResolvedValue(mockChallenges);

      await getAllChallenges(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("getChallengeById", () => {
    it("should fetch a challenge by id successfully", async () => {
      const req = {
        user: { id: 1 },
        params: { id: "1" },
      };
      const res = mockResponse();

      const mockChallengeData = {
        id: 1,
        challengeName: "Photo Challenge",
        description: "Best photo wins",
        award: "Free Trip",
        result: "pending",
        winnerId: null,
        submissions: [
          {
            submissionId: 1,
            userId: 1,
            caption: "My photo",
            user: { id: 1, username: "user1" },
          },
        ],
        toJSON: jest.fn().mockReturnValue({
          id: 1,
          challengeName: "Photo Challenge",
          description: "Best photo wins",
          award: "Free Trip",
          result: "pending",
          winnerId: null,
          submissions: [
            {
              submissionId: 1,
              userId: 1,
              caption: "My photo",
              user: { id: 1, username: "user1" },
            },
          ],
        }),
      };

      mockChallenge.findByPk.mockResolvedValue(mockChallengeData);

      await getChallengeById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Challenge fetched successfully",
        }),
      );
    });

    it("should return 404 if challenge not found", async () => {
      const req = {
        user: { id: 1 },
        params: { id: "999" },
      };
      const res = mockResponse();

      mockChallenge.findByPk.mockResolvedValue(null);

      await getChallengeById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({
        message: "Challenge not found",
      });
    });

    it("should include winner submission when result is published", async () => {
      const req = {
        user: { id: 1 },
        params: { id: "1" },
      };
      const res = mockResponse();

      const mockChallengeData = {
        id: 1,
        challengeName: "Completed Challenge",
        result: "published",
        winnerId: 2,
        submissions: [
          { submissionId: 1, userId: 1, caption: "My photo" },
          { submissionId: 2, userId: 2, caption: "Winner photo" },
        ],
        toJSON: jest.fn().mockReturnValue({
          id: 1,
          challengeName: "Completed Challenge",
          result: "published",
          winnerId: 2,
          submissions: [
            { submissionId: 1, userId: 1, caption: "My photo" },
            { submissionId: 2, userId: 2, caption: "Winner photo" },
          ],
        }),
      };

      mockChallenge.findByPk.mockResolvedValue(mockChallengeData);

      await getChallengeById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = res.send.mock.calls[0][0].data;
      expect(responseData.winnerSubmission).toBeDefined();
    });
  });

  describe("submitChallenge", () => {
    it("should submit to a challenge successfully", async () => {
      const req = {
        user: { id: 1 },
        params: { id: "1" },
        body: { caption: "My amazing photo!" },
        files: [{ path: "uploads\\submissions\\photo.jpg" }],
      };
      const res = mockResponse();

      const mockChallengeData = {
        id: 1,
        challengeName: "Photo Challenge",
      };

      const mockCreatedSubmission = {
        submissionId: 1,
        challengeId: 1,
        userId: 1,
        caption: "My amazing photo!",
        images: ["uploads/submissions/photo.jpg"],
      };

      mockChallenge.findByPk.mockResolvedValue(mockChallengeData);
      mockSubmission.findOne.mockResolvedValue(null);
      mockSubmission.create.mockResolvedValue(mockCreatedSubmission);

      await submitChallenge(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Challenge submitted successfully",
        }),
      );
    });

    it("should return 401 if user is not authenticated", async () => {
      const req = {
        user: null,
        params: { id: "1" },
        body: { caption: "Test" },
      };
      const res = mockResponse();

      await submitChallenge(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith({
        message: "User not authenticated",
      });
    });

    it("should return 404 if challenge not found", async () => {
      const req = {
        user: { id: 1 },
        params: { id: "999" },
        body: { caption: "Test" },
      };
      const res = mockResponse();

      mockChallenge.findByPk.mockResolvedValue(null);

      await submitChallenge(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({
        message: "Challenge not found",
      });
    });

    it("should return 400 if user already submitted", async () => {
      const req = {
        user: { id: 1 },
        params: { id: "1" },
        body: { caption: "Test" },
      };
      const res = mockResponse();

      mockChallenge.findByPk.mockResolvedValue({ id: 1 });
      mockSubmission.findOne.mockResolvedValue({
        submissionId: 1,
        userId: 1,
        challengeId: 1,
      });

      await submitChallenge(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: "You have already submitted your challenge",
      });
    });

    it("should handle submission without caption", async () => {
      const req = {
        user: { id: 1 },
        params: { id: "1" },
        body: {},
        file: { path: "uploads\\submissions\\photo.jpg" },
      };
      const res = mockResponse();

      mockChallenge.findByPk.mockResolvedValue({ id: 1 });
      mockSubmission.findOne.mockResolvedValue(null);
      mockSubmission.create.mockResolvedValue({
        submissionId: 1,
        challengeId: 1,
        userId: 1,
        caption: null,
        images: ["uploads/submissions/photo.jpg"],
      });

      await submitChallenge(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe("getTopChallengeUsers", () => {
    it("should fetch top users successfully", async () => {
      const req = {};
      const res = mockResponse();

      const mockTopUsers = [
        { id: 1, username: "topuser1", submissionCount: 10 },
        { id: 2, username: "topuser2", submissionCount: 8 },
        { id: 3, username: "topuser3", submissionCount: 5 },
      ];

      mockUser.findAll.mockResolvedValue(mockTopUsers);

      await getTopChallengeUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Global leaderboard fetched successfully",
        }),
      );
    });

    it("should return empty array when no users found", async () => {
      const req = {};
      const res = mockResponse();

      mockUser.findAll.mockResolvedValue([]);

      await getTopChallengeUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: [],
        }),
      );
    });
  });
});
