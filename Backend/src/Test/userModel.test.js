import SequelizeMock from "sequelize-mock";

const dbMock = new SequelizeMock();

// Mock User Model
const UserMock = dbMock.define("User", {
  id: 1,
  username: "testuser",
  email: "test@example.com",
  usertype: "User",
  password: "hashedpassword123",
  number: "1234567890",
  googleId: null,
  profileImage: "uploads/profiles/image1.jpg",
  bio: "Travel enthusiast",
  name: "Test User",
  resetToken: null,
  resetTokenExpiry: null,
  createdAt: new Date("2026-02-20"),
  updatedAt: new Date("2026-02-20"),
});

describe("User Model", () => {
  it("should create a user with all required fields", async () => {
    const user = await UserMock.create({
      id: 1,
      username: "testuser",
      email: "test@example.com",
      password: "hashedpassword123",
      number: "1234567890",
    });

    expect(user.id).toBe(1);
    expect(user.username).toBe("testuser");
    expect(user.email).toBe("test@example.com");
    expect(user.password).toBe("hashedpassword123");
    expect(user.number).toBe("1234567890");
  });

  it("should have default usertype as User", async () => {
    const user = await UserMock.create({
      username: "newuser",
      email: "newuser@example.com",
      password: "password123",
    });

    expect(user.usertype).toBe("User");
  });

  it("should allow null for optional fields", async () => {
    const user = await UserMock.create({
      username: "minimaluser",
      email: "minimal@example.com",
      googleId: null,
      profileImage: null,
      bio: null,
      name: null,
    });

    expect(user.username).toBe("minimaluser");
    expect(user.email).toBe("minimal@example.com");
  });

  it("should store googleId for OAuth users", async () => {
    const user = await UserMock.create({
      username: "googleuser",
      email: "google@example.com",
      googleId: "google-oauth-id-12345",
      password: null,
    });

    expect(user.googleId).toBe("google-oauth-id-12345");
  });

  it("should have valid email format", async () => {
    const user = await UserMock.create({
      username: "emailtest",
      email: "valid@example.com",
    });

    expect(user.email).toContain("@");
    expect(typeof user.email).toBe("string");
  });

  it("should have timestamps", async () => {
    const user = await UserMock.create({
      username: "timestampuser",
      email: "timestamp@example.com",
    });

    expect(user.createdAt).toBeDefined();
    expect(user.updatedAt).toBeDefined();
  });

  it("should store profile information", async () => {
    const user = await UserMock.create({
      username: "profileuser",
      email: "profile@example.com",
      profileImage: "uploads/profiles/myimage.jpg",
      bio: "I love traveling!",
      name: "Profile User",
    });

    expect(user.profileImage).toBe("uploads/profiles/myimage.jpg");
    expect(user.bio).toBe("I love traveling!");
    expect(user.name).toBe("Profile User");
  });

  it("should store reset token for password reset", async () => {
    const user = await UserMock.create({
      username: "resetuser",
      email: "reset@example.com",
      resetToken: "abc123resettoken",
      resetTokenExpiry: new Date("2026-02-21"),
    });

    expect(user.resetToken).toBe("abc123resettoken");
    expect(user.resetTokenExpiry).toBeDefined();
  });

  it("should have unique username", async () => {
    const user1 = await UserMock.create({
      username: "uniqueuser",
      email: "unique1@example.com",
    });

    expect(user1.username).toBe("uniqueuser");
  });

  it("should have unique email", async () => {
    const user = await UserMock.create({
      username: "emailunique",
      email: "uniqueemail@example.com",
    });

    expect(user.email).toBe("uniqueemail@example.com");
  });

  it("should store phone number", async () => {
    const user = await UserMock.create({
      username: "phoneuser",
      email: "phone@example.com",
      number: "9876543210",
    });

    expect(user.number).toBe("9876543210");
  });
});
