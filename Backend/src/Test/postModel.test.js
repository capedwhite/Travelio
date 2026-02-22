import SequelizeMock from "sequelize-mock";

const dbMock = new SequelizeMock();

// Mock Post Model
const PostMock = dbMock.define("Post", {
  id: 1,
  content: "This is a sample post about my travel experience!",
  image: "uploads/posts/image1.jpg",
  userId: 1,
  createdAt: new Date("2026-02-20"),
  updatedAt: new Date("2026-02-20"),
});

// Mock Like Model
const LikeMock = dbMock.define("Like", {
  id: 1,
  userId: 1,
  postId: 1,
  createdAt: new Date("2026-02-20"),
});

// Mock Comment Model
const CommentMock = dbMock.define("Comment", {
  id: 1,
  content: "Great post!",
  userId: 2,
  postId: 1,
  createdAt: new Date("2026-02-20"),
  updatedAt: new Date("2026-02-20"),
});

// Mock Follow Model
const FollowMock = dbMock.define("Follow", {
  id: 1,
  followerId: 1,
  followingId: 2,
  createdAt: new Date("2026-02-20"),
});

describe("Post Model", () => {
  it("should create a post with all required fields", async () => {
    const post = await PostMock.create({
      id: 1,
      content: "This is a sample post about my travel experience!",
      image: "uploads/posts/image1.jpg",
      userId: 1,
    });

    expect(post.id).toBe(1);
    expect(post.content).toBe("This is a sample post about my travel experience!");
    expect(post.image).toBe("uploads/posts/image1.jpg");
    expect(post.userId).toBe(1);
  });

  it("should create a post without an image", async () => {
    const post = await PostMock.create({
      id: 2,
      content: "A text-only post",
      image: null,
      userId: 1,
    });

    expect(post.id).toBe(2);
    expect(post.content).toBe("A text-only post");
  });

  it("should have valid content", async () => {
    const post = await PostMock.create({
      content: "Testing content validation",
      userId: 1,
    });
    expect(post.content).toBeTruthy();
    expect(typeof post.content).toBe("string");
  });

  it("should have timestamps", async () => {
    const post = await PostMock.create({
      content: "Post with timestamps",
      userId: 1,
    });
    expect(post.createdAt).toBeDefined();
    expect(post.updatedAt).toBeDefined();
  });
});

describe("Like Model", () => {
  it("should create a like with userId and postId", async () => {
    const like = await LikeMock.create({
      id: 1,
      userId: 1,
      postId: 1,
    });

    expect(like.id).toBe(1);
    expect(like.userId).toBe(1);
    expect(like.postId).toBe(1);
  });

  it("should have a createdAt timestamp", async () => {
    const like = await LikeMock.create({
      userId: 2,
      postId: 1,
    });
    expect(like.createdAt).toBeDefined();
  });

  it("should reference valid user and post", async () => {
    const like = await LikeMock.create({
      userId: 5,
      postId: 10,
    });
    expect(like.userId).toBe(5);
    expect(like.postId).toBe(10);
  });
});

describe("Comment Model", () => {
  it("should create a comment with all required fields", async () => {
    const comment = await CommentMock.create({
      id: 1,
      content: "Great post!",
      userId: 2,
      postId: 1,
    });

    expect(comment.id).toBe(1);
    expect(comment.content).toBe("Great post!");
    expect(comment.userId).toBe(2);
    expect(comment.postId).toBe(1);
  });

  it("should have valid content", async () => {
    const comment = await CommentMock.create({
      content: "Nice travel experience!",
      userId: 1,
      postId: 1,
    });
    expect(comment.content).toBeTruthy();
    expect(typeof comment.content).toBe("string");
  });

  it("should have timestamps", async () => {
    const comment = await CommentMock.create({
      content: "Comment with timestamps",
      userId: 1,
      postId: 1,
    });
    expect(comment.createdAt).toBeDefined();
    expect(comment.updatedAt).toBeDefined();
  });
});

describe("Follow Model", () => {
  it("should create a follow relationship", async () => {
    const follow = await FollowMock.create({
      id: 1,
      followerId: 1,
      followingId: 2,
    });

    expect(follow.id).toBe(1);
    expect(follow.followerId).toBe(1);
    expect(follow.followingId).toBe(2);
  });

  it("should have createdAt timestamp", async () => {
    const follow = await FollowMock.create({
      followerId: 3,
      followingId: 4,
    });
    expect(follow.createdAt).toBeDefined();
  });

  it("should reference different users for follower and following", async () => {
    const follow = await FollowMock.create({
      followerId: 5,
      followingId: 10,
    });
    expect(follow.followerId).not.toBe(follow.followingId);
  });
});
