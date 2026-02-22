import { jest } from "@jest/globals";

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
  sequelize: {
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

// Import controller after mocking
const { createPost, toggleLike, addComment, toggleFollow } = await import(
  "../Controller/postController.js"
);

describe("Post Controller", () => {
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

  describe("createPost", () => {
    it("should create a post successfully", async () => {
      const req = {
        user: { id: 1 },
        body: {
          content: "My amazing travel experience!",
        },
        file: {
          path: "uploads\\posts\\image1.jpg",
        },
      };
      const res = mockResponse();

      const mockCreatedPost = {
        id: 1,
        content: "My amazing travel experience!",
        image: "uploads/posts/image1.jpg",
        userId: 1,
      };

      const mockPostWithUser = {
        id: 1,
        content: "My amazing travel experience!",
        image: "uploads/posts/image1.jpg",
        userId: 1,
        user: { id: 1, username: "traveler1", email: "traveler@example.com" },
      };

      mockPost.create.mockResolvedValue(mockCreatedPost);
      mockPost.findByPk.mockResolvedValue(mockPostWithUser);

      await createPost(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Post created successfully",
        })
      );
    });

    it("should return 400 if content is missing", async () => {
      const req = {
        user: { id: 1 },
        body: {},
      };
      const res = mockResponse();

      await createPost(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: "Content is required",
      });
    });

    it("should return 401 if user is not authenticated", async () => {
      const req = {
        user: null,
        body: { content: "Test post" },
      };
      const res = mockResponse();

      await createPost(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith({
        message: "User not authenticated",
      });
    });

    it("should create post without image", async () => {
      const req = {
        user: { id: 1 },
        body: {
          content: "Text only post",
        },
        file: undefined,
      };
      const res = mockResponse();

      const mockCreatedPost = {
        id: 2,
        content: "Text only post",
        image: null,
        userId: 1,
      };

      mockPost.create.mockResolvedValue(mockCreatedPost);
      mockPost.findByPk.mockResolvedValue(mockCreatedPost);

      await createPost(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(mockPost.create).toHaveBeenCalledWith(
        expect.objectContaining({
          content: "Text only post",
          image: null,
        })
      );
    });
  });

  describe("toggleLike", () => {
    it("should like a post when not already liked", async () => {
      const req = {
        user: { id: 1 },
        params: { postId: "1" },
      };
      const res = mockResponse();

      mockLike.findOne.mockResolvedValue(null);
      mockLike.create.mockResolvedValue({ id: 1, userId: 1, postId: 1 });

      await toggleLike(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({
        message: "Post liked successfully",
      });
    });

    it("should unlike a post when already liked", async () => {
      const req = {
        user: { id: 1 },
        params: { postId: "1" },
      };
      const res = mockResponse();

      const existingLike = {
        id: 1,
        userId: 1,
        postId: 1,
        destroy: jest.fn().mockResolvedValue(true),
      };

      mockLike.findOne.mockResolvedValue(existingLike);

      await toggleLike(req, res);

      expect(existingLike.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        message: "Post unliked successfully",
      });
    });

    it("should return 401 if user is not authenticated", async () => {
      const req = {
        user: null,
        params: { postId: "1" },
      };
      const res = mockResponse();

      await toggleLike(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith({
        message: "User not authenticated",
      });
    });
  });

  describe("addComment", () => {
    it("should add a comment successfully", async () => {
      const req = {
        user: { id: 1 },
        params: { postId: "1" },
        body: { content: "Great post!" },
      };
      const res = mockResponse();

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

      await addComment(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Comment added successfully",
        })
      );
    });

    it("should return 400 if comment content is missing", async () => {
      const req = {
        user: { id: 1 },
        params: { postId: "1" },
        body: {},
      };
      const res = mockResponse();

      await addComment(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: "Comment content is required",
      });
    });

    it("should return 401 if user is not authenticated", async () => {
      const req = {
        user: null,
        params: { postId: "1" },
        body: { content: "Test comment" },
      };
      const res = mockResponse();

      await addComment(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith({
        message: "User not authenticated",
      });
    });
  });

  describe("toggleFollow", () => {
    it("should follow a user when not already following", async () => {
      const req = {
        user: { id: 1 },
        params: { userId: "2" },
      };
      const res = mockResponse();

      mockFollow.findOne.mockResolvedValue(null);
      mockFollow.create.mockResolvedValue({
        id: 1,
        followerId: 1,
        followingId: 2,
      });

      await toggleFollow(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          isFollowing: true,
          message: "User followed successfully",
        })
      );
    });

    it("should unfollow a user when already following", async () => {
      const req = {
        user: { id: 1 },
        params: { userId: "2" },
      };
      const res = mockResponse();

      const existingFollow = {
        id: 1,
        followerId: 1,
        followingId: 2,
        destroy: jest.fn().mockResolvedValue(true),
      };

      mockFollow.findOne.mockResolvedValue(existingFollow);

      await toggleFollow(req, res);

      expect(existingFollow.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          isFollowing: false,
          message: "User unfollowed successfully",
        })
      );
    });

    it("should return 400 when trying to follow yourself", async () => {
      const req = {
        user: { id: 1 },
        params: { userId: "1" },
      };
      const res = mockResponse();

      await toggleFollow(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: "Cannot follow yourself",
      });
    });

    it("should return 401 if user is not authenticated", async () => {
      const req = {
        user: null,
        params: { userId: "2" },
      };
      const res = mockResponse();

      await toggleFollow(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith({
        message: "User not authenticated",
      });
    });
  });
});
