import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";

// Mock the Post model
const mockPost = {
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
  findOne: jest.fn(),
};

// Mock the Like model
const mockLike = {
  create: jest.fn(),
  findOne: jest.fn(),
  destroy: jest.fn(),
};

// Mock the Comment model
const mockComment = {
  create: jest.fn(),
  findByPk: jest.fn(),
};

// Mock the Follow model
const mockFollow = {
  create: jest.fn(),
  findOne: jest.fn(),
  destroy: jest.fn(),
};

// Mock the User model
const mockUser = {
  findByPk: jest.fn(),
  findAll: jest.fn(),
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

jest.unstable_mockModule("../Model/postModel.js", () => ({
  Post: mockPost,
}));

jest.unstable_mockModule("../Model/Like.js", () => ({
  Like: mockLike,
}));

jest.unstable_mockModule("../Model/Comments.js", () => ({
  Comment: mockComment,
}));

jest.unstable_mockModule("../Model/Follow.js", () => ({
  Follow: mockFollow,
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

// Mock multer
jest.unstable_mockModule("../Config/multer.js", () => ({
  default: {
    single: () => (req, res, next) => {
      if (req.body.hasImage) {
        req.file = { path: "uploads\\posts\\test-image.jpg" };
      }
      next();
    },
    any: () => (req, res, next) => next(),
  },
}));

// Import after mocking
const { createPost, toggleLike, addComment, toggleFollow } = await import(
  "../Controller/postController.js"
);

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
  app.post("/user/posts", createPost);
  app.post("/user/posts/:postId/like", toggleLike);
  app.post("/user/posts/:postId/comment", addComment);
  app.post("/user/users/:userId/follow", toggleFollow);

  return app;
};

describe("Post Routes", () => {
  let app;

  beforeAll(() => {
    app = createTestApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /user/posts", () => {
    it("should create a post with status 201", async () => {
      const mockCreatedPost = {
        id: 1,
        content: "My travel experience!",
        image: null,
        userId: 1,
      };

      const mockPostWithUser = {
        id: 1,
        content: "My travel experience!",
        image: null,
        userId: 1,
        user: { id: 1, username: "traveler1", email: "traveler@example.com" },
      };

      mockPost.create.mockResolvedValue(mockCreatedPost);
      mockPost.findByPk.mockResolvedValue(mockPostWithUser);

      const response = await request(app).post("/user/posts").send({
        content: "My travel experience!",
      });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Post created successfully");
    });

    it("should return 400 if content is missing", async () => {
      const response = await request(app).post("/user/posts").send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Content is required");
    });
  });

  describe("POST /user/posts/:postId/like", () => {
    it("should like a post with status 201", async () => {
      mockLike.findOne.mockResolvedValue(null);
      mockLike.create.mockResolvedValue({ id: 1, userId: 1, postId: 1 });

      const response = await request(app).post("/user/posts/1/like");

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Post liked successfully");
    });

    it("should unlike a post with status 200", async () => {
      const existingLike = {
        id: 1,
        userId: 1,
        postId: 1,
        destroy: jest.fn().mockResolvedValue(true),
      };

      mockLike.findOne.mockResolvedValue(existingLike);

      const response = await request(app).post("/user/posts/1/like");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Post unliked successfully");
    });
  });

  describe("POST /user/posts/:postId/comment", () => {
    it("should add a comment with status 201", async () => {
      const mockCreatedComment = {
        id: 1,
        content: "Great post!",
        postId: 1,
        userId: 1,
      };

      const mockCommentWithUser = {
        id: 1,
        content: "Great post!",
        postId: 1,
        userId: 1,
        user: { id: 1, username: "traveler1" },
      };

      mockComment.create.mockResolvedValue(mockCreatedComment);
      mockComment.findByPk.mockResolvedValue(mockCommentWithUser);

      const response = await request(app).post("/user/posts/1/comment").send({
        content: "Great post!",
      });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Comment added successfully");
    });

    it("should return 400 if comment content is missing", async () => {
      const response = await request(app).post("/user/posts/1/comment").send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Comment content is required");
    });
  });

  describe("POST /user/users/:userId/follow", () => {
    it("should follow a user with status 200", async () => {
      mockFollow.findOne.mockResolvedValue(null);
      mockFollow.create.mockResolvedValue({
        id: 1,
        followerId: 1,
        followingId: 2,
      });

      const response = await request(app).post("/user/users/2/follow");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("User followed successfully");
      expect(response.body.isFollowing).toBe(true);
    });

    it("should unfollow a user with status 200", async () => {
      const existingFollow = {
        id: 1,
        followerId: 1,
        followingId: 2,
        destroy: jest.fn().mockResolvedValue(true),
      };

      mockFollow.findOne.mockResolvedValue(existingFollow);

      const response = await request(app).post("/user/users/2/follow");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("User unfollowed successfully");
      expect(response.body.isFollowing).toBe(false);
    });

    it("should return 400 when trying to follow yourself", async () => {
      const response = await request(app).post("/user/users/1/follow");

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Cannot follow yourself");
    });
  });
});
