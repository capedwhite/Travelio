import { Post } from "../Model/postModel.js";
import { Like } from "../Model/Like.js";
import { Comment } from "../Model/Comments.js";
import { Follow } from "../Model/Follow.js";
import { User } from "../Model/userModel.js";

// Create a new post
export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).send({ message: "User not authenticated" });
    }

    if (!content) {
      return res.status(400).send({ message: "Content is required" });
    }

    let imagePath = null;
    if (req.file) {
      imagePath = req.file.path.replace(/\\/g, "/");
    }

    const post = await Post.create({
      content,
      image: imagePath,
      userId,
    });

    // Fetch the post with user details
    const postWithUser = await Post.findByPk(post.id, {
      include: [
        {
          model: User,
          attributes: ["id", "username", "email"],
        },
      ],
    });

    res.status(201).send({
      data: postWithUser,
      message: "Post created successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

// Get all posts for feed
export const getAllPosts = async (req, res) => {
  try {
    const userId = req.user?.id;

    const posts = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "username", "email"],
        },
        {
          model: Like,
          required: false,
          include: [
            {
              model: User,
              attributes: ["id", "username"],
            },
          ],
        },
        {
          model: Comment,
          required: false,
          include: [
            {
              model: User,
              attributes: ["id", "username"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Add like status for current user
    const postsWithLikes = posts.map((post) => {
      const postData = post.toJSON();
      postData.isLiked = userId
        ? postData.likes?.some((like) => like.userId === userId)
        : false;
      postData.likeCount = postData.likes?.length || 0;
      postData.commentCount = postData.comments?.length || 0;
      return postData;
    });

    res.status(200).send({
      data: postsWithLikes,
      message: "Posts fetched successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

// Like/Unlike a post
export const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).send({ message: "User not authenticated" });
    }

    const existingLike = await Like.findOne({
      where: { postId, userId },
    });

    if (existingLike) {
      // Unlike
      await existingLike.destroy();
      res.status(200).send({ message: "Post unliked successfully" });
    } else {
      // Like
      await Like.create({ postId, userId });
      res.status(201).send({ message: "Post liked successfully" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

// Add comment to post
export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).send({ message: "User not authenticated" });
    }

    if (!content) {
      return res.status(400).send({ message: "Comment content is required" });
    }

    const comment = await Comment.create({
      content,
      postId,
      userId,
    });

    // Fetch comment with user details
    const commentWithUser = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          attributes: ["id", "username"],
        },
      ],
    });

    res.status(201).send({
      data: commentWithUser,
      message: "Comment added successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

// Follow/Unfollow a user
export const toggleFollow = async (req, res) => {
  try {
    const { userId: targetUserId } = req.params;
    const currentUserId = req.user?.id;

    if (!currentUserId) {
      return res.status(401).send({ message: "User not authenticated" });
    }

    if (currentUserId === parseInt(targetUserId)) {
      return res.status(400).send({ message: "Cannot follow yourself" });
    }

    const existingFollow = await Follow.findOne({
      where: {
        followerId: currentUserId,
        followingId: targetUserId,
      },
    });

    if (existingFollow) {
      // Unfollow
      await existingFollow.destroy();
      res.status(200).send({ message: "User unfollowed successfully" });
    } else {
      // Follow
      await Follow.create({
        followerId: currentUserId,
        followingId: targetUserId,
      });
      res.status(201).send({ message: "User followed successfully" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

// Get top users by post count
export const getTopUsers = async (req, res) => {
  try {
    const topUsers = await User.findAll({
      include: [
        {
          model: Post,
          attributes: [],
          required: false,
        },
      ],
      attributes: [
        "id",
        "username",
        [
          User.sequelize.fn("COUNT", User.sequelize.col("posts.id")),
          "postCount",
        ],
      ],
      group: ["users.id"],
      order: [[User.sequelize.literal("postCount"), "DESC"]],
      limit: 10,
    });

    res.status(200).send({
      data: topUsers,
      message: "Top users fetched successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

// Get users that current user follows
export const getFollowing = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).send({ message: "User not authenticated" });
    }

    const following = await User.findAll({
      include: [
        {
          model: User,
          as: "Followers",
          where: { id: userId },
          attributes: [],
          through: { attributes: [] },
        },
      ],
      attributes: ["id", "username", "email"],
    });

    res.status(200).send({
      data: following,
      message: "Following list fetched successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

// Get user profile with posts
export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user?.id;

    const user = await User.findByPk(userId, {
      include: [
        {
          model: Post,
          include: [
            {
              model: Like,
              required: false,
              include: [
                {
                  model: User,
                  attributes: ["id", "username"],
                },
              ],
            },
            {
              model: Comment,
              required: false,
              include: [
                {
                  model: User,
                  attributes: ["id", "username"],
                },
              ],
            },
          ],
          order: [["createdAt", "DESC"]],
        },
        {
          model: User,
          as: "Followers",
          attributes: ["id", "username"],
          through: { attributes: [] },
        },
        {
          model: User,
          as: "Following",
          attributes: ["id", "username"],
          through: { attributes: [] },
        },
      ],
    });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const userData = user.toJSON();

    // Add post stats and like status
    userData.posts = userData.posts.map((post) => ({
      ...post,
      isLiked: currentUserId
        ? post.likes?.some((like) => like.userId === currentUserId)
        : false,
      likeCount: post.likes?.length || 0,
      commentCount: post.comments?.length || 0,
    }));

    userData.stats = {
      posts: userData.posts.length,
      followers: userData.Followers?.length || 0,
      following: userData.Following?.length || 0,
    };

    // Check if current user follows this user
    userData.isFollowing = currentUserId
      ? userData.Followers?.some((follower) => follower.id === currentUserId)
      : false;

    res.status(200).send({
      data: userData,
      message: "User profile fetched successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};
