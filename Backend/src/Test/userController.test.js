import { jest } from "@jest/globals";

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

// Import controller after mocking
const { login, signUp, forgotPassword, resetPassword, googleCallback } =
  await import("../Controller/authController.js");

describe("Auth Controller", () => {
  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    res.redirect = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("should return 401 if username is null", async () => {
      const req = {
        body: { username: null, password: "password123" },
      };
      const res = mockResponse();

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith({
        message: "cannot leave email field empty",
      });
    });

    it("should return 401 if password is null", async () => {
      const req = {
        body: { username: "testuser", password: null },
      };
      const res = mockResponse();

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith({
        message: "cannot leave password field empty",
      });
    });

    it("should return 500 if user not found", async () => {
      const req = {
        body: { username: "nonexistent", password: "password123" },
      };
      const res = mockResponse();

      mockUser.findOne.mockResolvedValue(null);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: "Invalid credentials",
      });
    });

    it("should return 500 if password does not match", async () => {
      const req = {
        body: { username: "testuser", password: "wrongpassword" },
      };
      const res = mockResponse();

      mockUser.findOne.mockResolvedValue({
        id: 1,
        username: "testuser",
        password: "hashedpassword",
        role: "User",
      });
      mockBcrypt.compare.mockResolvedValue(false);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: "Invalid credentials",
      });
    });

    it("should return 200 with token for successful user login", async () => {
      const req = {
        body: { username: "testuser", password: "password123" },
      };
      const res = mockResponse();

      const mockUserData = {
        id: 1,
        username: "testuser",
        password: "hashedpassword",
        role: "User",
      };

      mockUser.findOne.mockResolvedValue(mockUserData);
      mockBcrypt.compare.mockResolvedValue(true);
      mockGenerateToken.mockReturnValue("jwt-token-123");

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        token: "jwt-token-123",
        data: mockUserData,
        message: "User logged in successfully",
      });
    });

    it("should return admin message for admin login", async () => {
      const req = {
        body: { username: "admin", password: "adminpass123" },
      };
      const res = mockResponse();

      const mockAdminData = {
        id: 1,
        username: "admin",
        password: "hashedpassword",
        role: "Admin",
      };

      mockUser.findOne.mockResolvedValue(mockAdminData);
      mockBcrypt.compare.mockResolvedValue(true);
      mockGenerateToken.mockReturnValue("admin-token-123");

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        token: "admin-token-123",
        data: mockAdminData,
        message: "Admin logged in successfully",
      });
    });

    it("should handle server errors", async () => {
      const req = {
        body: { username: "testuser", password: "password123" },
      };
      const res = mockResponse();

      mockUser.findOne.mockRejectedValue(new Error("Database error"));

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: "Database error",
      });
    });
  });

  describe("signUp", () => {
    it("should return 401 if required fields are missing", async () => {
      const req = {
        body: { email: "test@example.com" },
      };
      const res = mockResponse();

      await signUp(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith({
        message: "Cannot leave fields empty",
      });
    });

    it("should return 401 if email already exists", async () => {
      const req = {
        body: {
          username: "newuser",
          email: "existing@example.com",
          password: "password123",
          number: "1234567890",
        },
      };
      const res = mockResponse();

      mockUser.findOne.mockResolvedValueOnce({ id: 1 }); // email exists

      await signUp(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith({
        message: "user already exists in email",
      });
    });

    it("should return 401 if username already exists", async () => {
      const req = {
        body: {
          username: "existinguser",
          email: "new@example.com",
          password: "password123",
          number: "1234567890",
        },
      };
      const res = mockResponse();

      mockUser.findOne
        .mockResolvedValueOnce(null) // email doesn't exist
        .mockResolvedValueOnce({ id: 1 }); // username exists

      await signUp(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith({
        message: "Username already in-use",
      });
    });

    it("should return 401 if password does not meet requirements", async () => {
      const req = {
        body: {
          username: "newuser",
          email: "new@example.com",
          password: "short",
          number: "1234567890",
        },
      };
      const res = mockResponse();

      mockUser.findOne.mockResolvedValue(null);

      await signUp(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith({
        message: "password requirements not met",
      });
    });

    it("should create user successfully with valid data", async () => {
      const req = {
        body: {
          username: "newuser",
          email: "new@example.com",
          password: "password123",
          number: "1234567890",
        },
      };
      const res = mockResponse();

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

      await signUp(req, res);

      expect(mockBcrypt.hash).toHaveBeenCalledWith("password123", 10);
      expect(mockUser.create).toHaveBeenCalledWith({
        username: "newuser",
        email: "new@example.com",
        password: "hashedpassword",
        number: "1234567890",
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        token: "new-user-token",
        data: mockCreatedUser,
        message: "Logged in sucessfully",
      });
    });

    it("should handle server errors during signup", async () => {
      const req = {
        body: {
          username: "newuser",
          email: "new@example.com",
          password: "password123",
          number: "1234567890",
        },
      };
      const res = mockResponse();

      mockUser.findOne.mockRejectedValue(new Error("Database error"));

      await signUp(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: "Database error",
      });
    });
  });

  describe("forgotPassword", () => {
    it("should return 400 if email is not provided", async () => {
      const req = {
        body: {},
      };
      const res = mockResponse();

      await forgotPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: "Email is required",
      });
    });

    it("should return 200 even if user not found (security)", async () => {
      const req = {
        body: { email: "nonexistent@example.com" },
      };
      const res = mockResponse();

      mockUser.findOne.mockResolvedValue(null);

      await forgotPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        message:
          "If an account with that email exists, a reset link has been sent.",
      });
    });

    it("should send reset email for existing user", async () => {
      const req = {
        body: { email: "test@example.com" },
      };
      const res = mockResponse();

      const mockUserData = {
        id: 1,
        email: "test@example.com",
        update: jest.fn().mockResolvedValue(true),
      };

      mockUser.findOne.mockResolvedValue(mockUserData);
      mockSendMail.mockResolvedValue(true);

      await forgotPassword(req, res);

      expect(mockUserData.update).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should handle errors when sending email fails", async () => {
      const req = {
        body: { email: "test@example.com" },
      };
      const res = mockResponse();

      const mockUserData = {
        id: 1,
        email: "test@example.com",
        update: jest.fn().mockResolvedValue(true),
      };

      mockUser.findOne.mockResolvedValue(mockUserData);
      mockSendMail.mockRejectedValue(new Error("SMTP error"));

      await forgotPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: "Failed to send reset email. Please try again.",
      });
    });
  });

  describe("resetPassword", () => {
    it("should return 400 if token or password is missing", async () => {
      const req = {
        body: { token: "sometoken" },
      };
      const res = mockResponse();

      await resetPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: "Token and password are required",
      });
    });

    it("should return 400 if token is invalid", async () => {
      const req = {
        body: { token: "invalidtoken", password: "newpassword123" },
      };
      const res = mockResponse();

      mockUser.findOne.mockResolvedValue(null);

      await resetPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: "Invalid or expired reset token",
      });
    });

    it("should return 400 if token has expired", async () => {
      const req = {
        body: { token: "expiredtoken", password: "newpassword123" },
      };
      const res = mockResponse();

      const expiredDate = new Date(Date.now() - 3600000); // 1 hour ago
      mockUser.findOne.mockResolvedValue({
        id: 1,
        resetToken: "expiredtoken",
        resetTokenExpiry: expiredDate,
      });

      await resetPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: "Reset token has expired",
      });
    });

    it("should return 400 if new password does not meet requirements", async () => {
      const req = {
        body: { token: "validtoken", password: "short" },
      };
      const res = mockResponse();

      const futureDate = new Date(Date.now() + 3600000);
      mockUser.findOne.mockResolvedValue({
        id: 1,
        resetToken: "validtoken",
        resetTokenExpiry: futureDate,
      });

      await resetPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should successfully reset password with valid token", async () => {
      const req = {
        body: { token: "validtoken", password: "newpassword123" },
      };
      const res = mockResponse();

      const futureDate = new Date(Date.now() + 3600000);
      const mockUserData = {
        id: 1,
        resetToken: "validtoken",
        resetTokenExpiry: futureDate,
        update: jest.fn().mockResolvedValue(true),
      };

      mockUser.findOne.mockResolvedValue(mockUserData);
      mockBcrypt.hash.mockResolvedValue("newhashedpassword");

      await resetPassword(req, res);

      expect(mockBcrypt.hash).toHaveBeenCalledWith("newpassword123", 10);
      expect(mockUserData.update).toHaveBeenCalledWith({
        password: "newhashedpassword",
        resetToken: null,
        resetTokenExpiry: null,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        message: "Password reset successful",
      });
    });

    it("should handle server errors during password reset", async () => {
      const req = {
        body: { token: "validtoken", password: "newpassword123" },
      };
      const res = mockResponse();

      mockUser.findOne.mockRejectedValue(new Error("Database error"));

      await resetPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: "Failed to reset password. Please try again.",
      });
    });
  });

  describe("googleCallback", () => {
    it("should return 400 if no user in request", () => {
      const req = { user: null };
      const res = mockResponse();

      googleCallback(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "No user information found from Google",
      });
    });

    it("should redirect with token on successful Google auth", () => {
      const req = {
        user: { id: 1, email: "google@example.com" },
      };
      const res = mockResponse();

      mockGenerateToken.mockReturnValue("google-token-123");

      googleCallback(req, res);

      expect(mockGenerateToken).toHaveBeenCalledWith(req.user);
      expect(res.redirect).toHaveBeenCalledWith(
        expect.stringContaining("google-success?token=google-token-123"),
      );
    });
  });
});
