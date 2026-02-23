import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";

// Mock the User model
const mockUser = {
  findOne: jest.fn(),
  create: jest.fn(),
  findByPk: jest.fn(),
};

// Mock bcrypt
const mockBcrypt = {
  compare: jest.fn(),
  hash: jest.fn(),
};

// Mock jwt utility
const mockGenerateToken = jest.fn();

// Mock nodemailer
const mockSendMail = jest.fn();
const mockTransporter = {
  sendMail: mockSendMail,
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

jest.unstable_mockModule("../Model/userModel.js", () => ({
  User: mockUser,
}));

jest.unstable_mockModule("bcryptjs", () => ({
  default: mockBcrypt,
}));

jest.unstable_mockModule("../Utills/jwt.js", () => ({
  generateToken: mockGenerateToken,
}));

jest.unstable_mockModule("nodemailer", () => ({
  default: {
    createTransport: jest.fn().mockReturnValue(mockTransporter),
  },
}));

// Mock passport
jest.unstable_mockModule("passport", () => ({
  default: {
    authenticate: jest.fn(() => (req, res, next) => {
      req.user = { id: 1, email: "google@example.com" };
      next();
    }),
    initialize: jest.fn(() => (req, res, next) => next()),
  },
}));

// Import controller after mocking
const { login, signUp, forgotPassword, resetPassword, googleCallback } =
  await import("../Controller/authController.js");

// Create a test app
const createTestApp = () => {
  const app = express();
  app.use(express.json());

  // Define routes matching authRoutes.js
  app.post("/auth/login", login);
  app.post("/auth/signup", signUp);
  app.post("/auth/forgot-password", forgotPassword);
  app.post("/auth/reset-password", resetPassword);
  app.get(
    "/auth/google",
    (req, res, next) => {
      req.user = { id: 1, email: "google@example.com" };
      next();
    },
    googleCallback,
  );
  app.get(
    "/auth/google/callback",
    (req, res, next) => {
      req.user = { id: 1, email: "google@example.com" };
      next();
    },
    googleCallback,
  );

  return app;
};

describe("Auth Routes", () => {
  let app;

  beforeAll(() => {
    app = createTestApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /auth/login", () => {
    it("should login user successfully with valid credentials", async () => {
      const mockUserData = {
        id: 1,
        username: "testuser",
        password: "hashedpassword",
        role: "User",
      };

      mockUser.findOne.mockResolvedValue(mockUserData);
      mockBcrypt.compare.mockResolvedValue(true);
      mockGenerateToken.mockReturnValue("jwt-token-123");

      const response = await request(app).post("/auth/login").send({
        username: "testuser",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body.token).toBe("jwt-token-123");
      expect(response.body.message).toBe("User logged in successfully");
    });

    it("should return 401 if username is null", async () => {
      const response = await request(app).post("/auth/login").send({
        username: null,
        password: "password123",
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("cannot leave email field empty");
    });

    it("should return 401 if password is null", async () => {
      const response = await request(app).post("/auth/login").send({
        username: "testuser",
        password: null,
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("cannot leave password field empty");
    });

    it("should return 500 if user not found", async () => {
      mockUser.findOne.mockResolvedValue(null);

      const response = await request(app).post("/auth/login").send({
        username: "nonexistent",
        password: "password123",
      });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Invalid credentials");
    });

    it("should return 500 if password is incorrect", async () => {
      mockUser.findOne.mockResolvedValue({
        id: 1,
        username: "testuser",
        password: "hashedpassword",
      });
      mockBcrypt.compare.mockResolvedValue(false);

      const response = await request(app).post("/auth/login").send({
        username: "testuser",
        password: "wrongpassword",
      });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Invalid credentials");
    });
  });

  describe("POST /auth/signup", () => {
    it("should create user successfully with valid data", async () => {
      const mockCreatedUser = {
        id: 1,
        username: "newuser",
        email: "new@example.com",
        number: "1234567890",
      };

      mockUser.findOne.mockResolvedValue(null);
      mockBcrypt.hash.mockResolvedValue("hashedpassword");
      mockUser.create.mockResolvedValue(mockCreatedUser);
      mockGenerateToken.mockReturnValue("new-user-token");

      const response = await request(app).post("/auth/signup").send({
        username: "newuser",
        email: "new@example.com",
        password: "password123",
        number: "1234567890",
      });

      expect(response.status).toBe(200);
      expect(response.body.token).toBe("new-user-token");
      expect(response.body.message).toBe("Logged in sucessfully");
    });

    it("should return 401 if required fields are missing", async () => {
      const response = await request(app).post("/auth/signup").send({
        email: "test@example.com",
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Cannot leave fields empty");
    });

    it("should return 401 if email already exists", async () => {
      mockUser.findOne.mockResolvedValueOnce({ id: 1 });

      const response = await request(app).post("/auth/signup").send({
        username: "newuser",
        email: "existing@example.com",
        password: "password123",
        number: "1234567890",
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("user already exists in email");
    });

    it("should return 401 if username already exists", async () => {
      mockUser.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: 1 });

      const response = await request(app).post("/auth/signup").send({
        username: "existinguser",
        email: "new@example.com",
        password: "password123",
        number: "1234567890",
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Username already in-use");
    });

    it("should return 401 if password does not meet requirements", async () => {
      mockUser.findOne.mockResolvedValue(null);

      const response = await request(app).post("/auth/signup").send({
        username: "newuser",
        email: "new@example.com",
        password: "short",
        number: "1234567890",
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("password requirements not met");
    });
  });

  describe("POST /auth/forgot-password", () => {
    it("should return 400 if email is not provided", async () => {
      const response = await request(app)
        .post("/auth/forgot-password")
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Email is required");
    });

    it("should return 200 even if user not found", async () => {
      mockUser.findOne.mockResolvedValue(null);

      const response = await request(app).post("/auth/forgot-password").send({
        email: "nonexistent@example.com",
      });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        "If an account with that email exists, a reset link has been sent.",
      );
    });

    it("should send reset email for existing user", async () => {
      const mockUserData = {
        id: 1,
        email: "test@example.com",
        update: jest.fn().mockResolvedValue(true),
      };

      mockUser.findOne.mockResolvedValue(mockUserData);
      mockSendMail.mockResolvedValue(true);

      const response = await request(app).post("/auth/forgot-password").send({
        email: "test@example.com",
      });

      expect(response.status).toBe(200);
    });
  });

  describe("POST /auth/reset-password", () => {
    it("should return 400 if token or password is missing", async () => {
      const response = await request(app).post("/auth/reset-password").send({
        token: "sometoken",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Token and password are required");
    });

    it("should return 400 if token is invalid", async () => {
      mockUser.findOne.mockResolvedValue(null);

      const response = await request(app).post("/auth/reset-password").send({
        token: "invalidtoken",
        password: "newpassword123",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid or expired reset token");
    });

    it("should return 400 if token has expired", async () => {
      const expiredDate = new Date(Date.now() - 3600000);
      mockUser.findOne.mockResolvedValue({
        id: 1,
        resetToken: "expiredtoken",
        resetTokenExpiry: expiredDate,
      });

      const response = await request(app).post("/auth/reset-password").send({
        token: "expiredtoken",
        password: "newpassword123",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Reset token has expired");
    });

    it("should successfully reset password with valid token", async () => {
      const futureDate = new Date(Date.now() + 3600000);
      const mockUserData = {
        id: 1,
        resetToken: "validtoken",
        resetTokenExpiry: futureDate,
        update: jest.fn().mockResolvedValue(true),
      };

      mockUser.findOne.mockResolvedValue(mockUserData);
      mockBcrypt.hash.mockResolvedValue("newhashedpassword");

      const response = await request(app).post("/auth/reset-password").send({
        token: "validtoken",
        password: "newpassword123",
      });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Password reset successful");
    });
  });

  describe("GET /auth/google", () => {
    it("should redirect for Google OAuth", async () => {
      mockGenerateToken.mockReturnValue("google-token-123");

      const response = await request(app).get("/auth/google");

      expect(response.status).toBe(302);
    });
  });

  describe("GET /auth/google/callback", () => {
    it("should handle Google callback", async () => {
      mockGenerateToken.mockReturnValue("google-token-123");

      const response = await request(app).get("/auth/google/callback");

      expect(response.status).toBe(302);
    });
  });
});
