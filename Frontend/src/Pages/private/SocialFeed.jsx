import { useState, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Plus,
  User,
  Send,
  UserPlus,
  UserCheck,
  Edit2,
  Trash2,
} from "lucide-react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { useAuth } from "../../context/authContext";

function PostCard({
  post,
  onLike,
  onComment,
  onUserClick,
  onEdit,
  onDelete,
  isOwnPost,
  deleteLoading,
}) {
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);

  const handleComment = async () => {
    if (!commentText.trim()) return;
    await onComment(post.id, commentText);
    setCommentText("");
  };

  return (
    <div className="bg-white  rounded-2xl shadow-md overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
            {post.user?.profileImage ? (
              <img
                src={`http://localhost:3000/${post.user.profileImage}`}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <User className="w-5 h-5 text-teal-600" />
            )}
          </div>
          <button
            onClick={() => onUserClick(post.user)}
            className="font-semibold text-gray-900 hover:text-teal-600 transition"
          >
            {post.user.username}
          </button>
        </div>
        <div className="flex items-center gap-2">
          {isOwnPost && (
            <>
              <button
                onClick={() => onEdit(post)}
                className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                title="Edit post"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(post.id)}
                disabled={deleteLoading === post.id}
                className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition disabled:opacity-50"
                title="Delete post"
              >
                {deleteLoading === post.id ? (
                  <ClipLoader size={14} color="#dc2626" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </>
          )}
          <span className="text-xs text-gray-500">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-4 pb-2">
        <p className="text-gray-800">{post.content}</p>
      </div>

      {post.image && (
        <img
          src={`http://localhost:3000/${post.image}`}
          className="w-full max-h-96 object-cover"
          alt="Post"
        />
      )}

      {/* ACTIONS */}
      <div className="flex items-center justify-between px-4 py-3 border-t">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onLike(post.id)}
            className="flex items-center gap-2 text-sm font-medium hover:text-red-500 transition"
          >
            <Heart
              className={`w-5 h-5 ${
                post.isLiked ? "fill-red-500 text-red-500" : "text-gray-500"
              }`}
            />
            <span>{post.likeCount}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-teal-500 transition"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{post.commentCount}</span>
          </button>
        </div>
      </div>

      {/* COMMENTS SECTION */}
      {showComments && (
        <div className="border-t bg-gray-50">
          {/* Existing Comments */}
          <div className="max-h-40 overflow-y-auto px-4 py-2 space-y-2">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <div key={comment.id} className="flex gap-2">
                  <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                     {post.user?.profileImage ? (
              <img
                src={`http://localhost:3000/${comment.user.profileImage}`}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <User className="w-3 h-3 text-teal-600" />
            )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs">
                      <span className="font-semibold text-gray-900">
                        {comment.user.username}
                      </span>
                      <span className="text-gray-700 ml-2">
                        {comment.content}
                      </span>
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 text-center py-2">
                No comments yet
              </p>
            )}
          </div>

          {/* Add Comment */}
          <div className="flex gap-2 p-3 border-t">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              onKeyPress={(e) => e.key === "Enter" && handleComment()}
            />
            <button
              onClick={handleComment}
              className="bg-teal-600 text-white p-2 rounded-lg hover:bg-teal-700 transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function UserProfileModal({ user, isOpen, onClose, onfollowChange }) {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      fetchUserDetails();
    }
  }, [user, isOpen]);

  const fetchUserDetails = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await api.get(`/user/users/${user.id}`);
      setUserDetails(res.data.data);
    } catch (error) {
      console.log(error.message);
      toast.error("Failed to load user profile");
    } finally {
      setLoading(false);
    }
  };

  const handleFollowClick = async () => {
    if (!userDetails) return;

    const previousStatus = userDetails.isFollowing;
    setUserDetails((prev) => ({ ...prev, isFollowing: !prev.isFollowing }));
    setFollowLoading(true);

    try {
      const res = await api.post(`/user/users/${user.id}/follow`);

      setUserDetails((prev) => ({
        ...prev,
        isFollowing: res.data.isFollowing,
      }));
      onfollowChange?.();
    } catch (error) {
      console.error("Failed to follow/unfollow:", error);

      // Step 4: Revert UI if API fails
      setUserDetails((prev) => ({ ...prev, isFollowing: previousStatus }));
      alert("Could not update follow status. Try again.");
    } finally {
      setFollowLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>

          {loading ? (
            <div className="text-center py-8">
              <ClipLoader size={25} color="#14B8A6" />
            </div>
          ) : userDetails ? (
            <>
              {/* User Header */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3 overflow-hidden">
                  {userDetails.profileImage ? (
                    <img
                      src={`http://localhost:3000/${userDetails.profileImage}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-teal-600" />
                  )}
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {userDetails.username}
                </h2>
                <p className="text-sm text-gray-500">{userDetails.email}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-teal-600">
                    {userDetails.stats?.posts || 0}
                  </p>
                  <p className="text-xs text-gray-500">Posts</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-teal-600">
                    {userDetails.stats?.followers || 0}
                  </p>
                  <p className="text-xs text-gray-500">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-teal-600">
                    {userDetails.stats?.following || 0}
                  </p>
                  <p className="text-xs text-gray-500">Following</p>
                </div>
              </div>

              {/* Follow Button */}
              <button
                onClick={handleFollowClick}
                disabled={followLoading}
                className={`w-full py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${
                  userDetails.isFollowing
                    ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    : "bg-teal-600 text-white hover:bg-teal-700"
                }`}
              >
                {followLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <ClipLoader
                      size={16}
                      color={userDetails.isFollowing ? "#374151" : "#ffffff"}
                    />
                    <span>Updating...</span>
                  </span>
                ) : userDetails.isFollowing ? (
                  <span className="flex items-center justify-center gap-2">
                    <UserCheck className="w-4 h-4" />
                    Following
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Follow
                  </span>
                )}
              </button>

              {/* Recent Posts Preview */}
              {userDetails.posts && userDetails.posts.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Recent Posts
                  </h3>
                  <div className="space-y-2">
                    {userDetails.posts.slice(0, 3).map((post) => (
                      <div
                        key={post.id}
                        className="border rounded-lg p-3 bg-gray-50"
                      >
                        <p className="text-sm text-gray-800 line-clamp-2">
                          {post.content}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {post.likeCount}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            {post.commentCount}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Failed to load user details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PackageSocialFeed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newPostOpen, setNewPostOpen] = useState(false);
  const [newPostText, setNewPostText] = useState("");
  const [newPostImage, setNewPostImage] = useState(null);
  const [topUsers, setTopUsers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followedPosts, setFollowedPosts] = useState([]);
  const [showAllFollowedPosts, setShowAllFollowedPosts] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchPosts();
    fetchTopUsers();
    fetchFollowing();
    fetchFollowedPosts();
  }, []);

  const fetchPosts = async (silent = false) => {
    try {
      if (!silent) setInitialLoading(true);
      const res = await api.get("/user/posts");
      setPosts(res.data.data);
    } catch (error) {
      if (!silent) console.log(error.message);
      toast.error("Failed to load posts");
    } finally {
      if (!silent) setInitialLoading(false);
    }
  };

  const fetchTopUsers = async () => {
    try {
      const res = await api.get("/user/topusers");
      console.log("Top Users Response:", res.data);
      // Handle different response structures
      setTopUsers(res.data.data || res.data || []);
    } catch (error) {
      console.log("Failed to load top users", error);
    }
  };

  const fetchFollowing = async () => {
    try {
      const res = await api.get("/user/following");
      setFollowing(res.data.data);
    } catch (error) {
      console.log("Failed to load following");
    }
  };

  const fetchFollowedPosts = async () => {
    try {
      const res = await api.get("/user/followed-posts");
      setFollowedPosts(res.data.data);
    } catch (error) {
      console.log("Failed to load followed posts");
    }
  };
  const refreshFollowingData = async () => {
    await fetchFollowing();
    await fetchFollowedPosts();
  };
  const handleCreatePost = async () => {
    if (!newPostText.trim()) return;

    const postingToast = toast.loading("Creating post...");
    try {
      const formData = new FormData();
      formData.append("content", newPostText);
      if (newPostImage) {
        formData.append("image", newPostImage);
      }

      await api.post("/user/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Post created successfully!", { id: postingToast });
      setNewPostOpen(false);
      setNewPostText("");
      setNewPostImage(null);
      fetchPosts(true);
      fetchTopUsers();
    } catch (error) {
      toast.error("Failed to create post", { id: postingToast });
    }
  };

  const handleLike = async (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1,
            }
          : post,
      ),
    );

    try {
      await api.post(`/user/posts/${postId}/like`);
      fetchPosts(true);
    } catch (error) {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                isLiked: !post.isLiked,
                likeCount: post.isLiked
                  ? post.likeCount - 1
                  : post.likeCount + 1,
              }
            : post,
        ),
      );
      toast.error("Failed to like post");
    }
  };

  const handleComment = async (postId, commentText) => {
    try {
      await api.post(`/user/posts/${postId}/comment`, { content: commentText });
      fetchPosts(true);
    } catch (error) {
      toast.error("Failed to add comment");
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setUserModalOpen(true);
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setEditContent(post.content);
    setEditImage(null);
    setEditModalOpen(true);
  };

  const handleUpdatePost = async () => {
    if (!editContent.trim()) return;

    try {
      const formData = new FormData();
      formData.append("content", editContent);
      if (editImage) {
        formData.append("image", editImage);
      }

      await api.put(`/user/posts/${editingPost.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Post updated successfully!");
      setEditModalOpen(false);
      fetchPosts(true);
    } catch (error) {
      toast.error("Failed to update post");
    }
  };

  const handleDeletePost = async (postId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this post? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      setDeleteLoading(postId);
      await api.delete(`/user/posts/${postId}`);
      toast.success("Post deleted successfully!");
      fetchPosts(true);
    } catch (error) {
      toast.error("Failed to delete post");
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className="px-4 md:px-10 py-10">
      <div className="max-w-7xl mx-auto flex gap-8">
        {/* LEFT SIDEBAR - Followed Posts */}
        <aside className="hidden lg:block w-80">
          {/* FOLLOWED POSTS */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Heart className="w-4 h-4 text-pink-500" />
              From People You Follow
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              Latest posts from your travel buddies
            </p>

            {followedPosts.length === 0 ? (
              <div className="text-center py-6">
                <Heart className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-500">
                  No posts from followed users yet
                </p>
                <p className="text-[10px] text-gray-400 mt-1">
                  Start following travelers!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {(showAllFollowedPosts
                  ? followedPosts
                  : followedPosts.slice(0, 4)
                ).map((post, idx) => (
                  <div
                    key={post.id}
                    className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100 rounded-xl p-4 hover:shadow-md transition-all duration-200 cursor-pointer group"
                    onClick={() => handleUserClick(post.user)}
                  >
                    {/* User Info */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center ring-2 ring-white shadow-sm overflow-hidden">
                        {post.user?.profileImage ? (
                          <img
                            src={`http://localhost:3000/${post.user.profileImage}`}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-pink-600 transition">
                          {post.user.username}
                        </p>
                        <p className="text-[10px] text-gray-500">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="space-y-2">
                      <p className="text-xs text-gray-700 line-clamp-3 leading-relaxed">
                        {post.content}
                      </p>

                      {post.image && (
                        <div className="relative w-full h-20 rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={`http://localhost:3000/${post.image}`}
                            alt="Post"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      )}

                      {/* Engagement Stats */}
                      <div className="flex items-center gap-3 text-[10px] text-gray-500 pt-1">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {post.likeCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          {post.commentCount}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {followedPosts.length > 4 && (
                  <button
                    onClick={() =>
                      setShowAllFollowedPosts(!showAllFollowedPosts)
                    }
                    className="w-full mt-3 py-2 px-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-medium rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                  >
                    <div className="flex items-center justify-center gap-2">
                      {showAllFollowedPosts ? (
                        <>
                          <span>Show Less</span>
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                        </>
                      ) : (
                        <>
                          <span>View All ({followedPosts.length})</span>
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </>
                      )}
                    </div>
                  </button>
                )}
              </div>
            )}
          </div>
        </aside>

        {/* MAIN CONTENT - Centered Posts */}
        <div className="flex-1 max-w-2xl mx-auto">
          {/* HEADER */}
          <div className="mb-6 mt-6 ">
            <span className="inline-flex  gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
              <User className="w-4 h-4" />
              Social Feed
            </span>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mt-2">
              Share Your Travel Stories
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Connect with fellow travelers and share your adventures
            </p>
          </div>

          {initialLoading ? (
            <div className="flex justify-center py-10">
              <ClipLoader size={35} color="#14B8A6" />
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onComment={handleComment}
                  onUserClick={handleUserClick}
                  onEdit={handleEditPost}
                  onDelete={handleDeletePost}
                  isOwnPost={user?.id === post.userId}
                  deleteLoading={deleteLoading}
                />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="hidden lg:block w-80">
          {/* TOP USERS */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-teal-600" />
              Top Contributors
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              Most active travelers on the platform
            </p>
            {!topUsers || topUsers.length === 0 ? (
              <div className="text-center py-4">
                <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-500">No active users yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topUsers.slice(0, 3).map((user, idx) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                    onClick={() => handleUserClick(user)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative">
                        <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center overflow-hidden">
                          {user.profileImage ? (
                            <img
                              src={`http://localhost:3000/${user.profileImage}`}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-5 h-5 text-teal-600" />
                          )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-teal-600 rounded-full flex items-center justify-center border-2 border-white">
                          <span className="text-[10px] font-bold text-white">
                            {idx + 1}
                          </span>
                        </div>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.username}
                        </p>
                        <p className="text-xs text-gray-500">
                          {user.postCount || 0} posts
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* FOLLOWING */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-green-600" />
              Following
            </h2>
            <p className="text-xs text-gray-500 mb-4">People you follow</p>
            {!following || following.length === 0 ? (
              <div className="text-center py-4">
                <UserCheck className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-500">
                  Not following anyone yet
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {following.slice(0, 5).map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                    onClick={() => handleUserClick(user)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center overflow-hidden">
                        {user.profileImage ? (
                          <img
                            src={`http://localhost:3000/${user.profileImage}`}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.username}
                        </p>
                        <p className="text-xs text-gray-500">Following</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* FLOATING CREATE POST BUTTON */}
      <button
        onClick={() => setNewPostOpen(true)}
        className="fixed right-6 bottom-6 bg-teal-600 text-white p-4 rounded-full shadow-lg hover:bg-teal-700 transition z-40"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* CREATE POST MODAL */}
      {newPostOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Share Your Experience
            </h2>

            <textarea
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4"
              rows={4}
              placeholder="How was your trip? Share your story..."
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
            />

            {/* Image Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Photo (Optional)
              </label>
              <div className="flex items-center gap-3">
                <label className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-teal-300 bg-teal-50/40 px-4 py-2 text-xs font-medium text-teal-700 hover:bg-teal-50">
                  <Plus className="w-3.5 h-3.5 mr-2" />
                  <span>Choose Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setNewPostImage(e.target.files[0])}
                  />
                </label>
                {newPostImage && (
                  <span className="text-xs text-gray-600 truncate max-w-[120px]">
                    {newPostImage.name}
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setNewPostOpen(false);
                  setNewPostText("");
                  setNewPostImage(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePost}
                disabled={!newPostText.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Share Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT POST MODAL */}
      {editModalOpen && editingPost && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Edit Your Post
            </h2>

            <textarea
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4"
              rows={4}
              placeholder="Update your post content..."
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />

            {/* Image Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Update Image (Optional)
              </label>
              <div className="flex items-center gap-3">
                <label className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-teal-300 bg-teal-50/40 px-4 py-2 text-xs font-medium text-teal-700 hover:bg-teal-50">
                  <Plus className="w-3.5 h-3.5 mr-2" />
                  <span>Choose New Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setEditImage(e.target.files[0])}
                  />
                </label>
                {editImage && (
                  <span className="text-xs text-gray-600 truncate max-w-[120px]">
                    {editImage.name}
                  </span>
                )}
              </div>
              {editingPost.image && !editImage && (
                <p className="text-xs text-gray-500 mt-1">
                  Current image will be kept
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdatePost}
                disabled={!editContent.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Update Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* USER PROFILE MODAL */}
      <UserProfileModal
        user={selectedUser}
        isOpen={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        onfollowChange={refreshFollowingData}
      />
    </div>
  );
}

export default PackageSocialFeed;
