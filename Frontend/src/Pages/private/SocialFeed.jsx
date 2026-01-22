import { useState, useEffect } from "react";
import { Heart, MessageCircle, Plus, User, Send, UserPlus, UserCheck } from "lucide-react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";

function PostCard({ post, onLike, onComment, onUserClick }) {
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
            <User className="w-5 h-5 text-teal-600" />
          </div>
          <button
            onClick={() => onUserClick(post.user)}
            className="font-semibold text-gray-900 hover:text-teal-600 transition"
          >
            {post.user.username}
          </button>
        </div>
        <span className="text-xs text-gray-500">
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
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
              post.comments.map(comment => (
                <div key={comment.id} className="flex gap-2">
                  <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-3 h-3 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs">
                      <span className="font-semibold text-gray-900">
                        {comment.user.username}
                      </span>
                      <span className="text-gray-700 ml-2">{comment.content}</span>
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
              onKeyPress={(e) => e.key === 'Enter' && handleComment()}
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

function UserProfileModal({ user, isOpen, onClose, onFollow }) {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);

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
      toast.error("Failed to load user profile");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={e=>e.stopPropagation(e)}>
        <div className="p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : userDetails ? (
            <>
              {/* User Header */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-10 h-10 text-teal-600" />
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
                onClick={() => onFollow(user.id)}
                className={`w-full py-3 rounded-lg font-medium transition ${
                  userDetails.isFollowing
                    ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    : "bg-teal-600 text-white hover:bg-teal-700"
                }`}
              >
                {userDetails.isFollowing ? (
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
                      <div key={post.id} className="border rounded-lg p-3 bg-gray-50">
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
  const [posts, setPosts] = useState([]);
  const [newPostOpen, setNewPostOpen] = useState(false);
  const [newPostText, setNewPostText] = useState("");
  const [newPostImage, setNewPostImage] = useState(null);
  const [topUsers, setTopUsers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
    fetchTopUsers();
    fetchFollowing();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true); // start loading
      const res = await api.get("/user/posts");
      setPosts(res.data.data); // save posts
    } catch (error) {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false); // stop loading in both success & error
    }
  };
  
  const fetchTopUsers = async () => {
    try {
      const res = await api.get("/user/topusers");
      setTopUsers(res.data.data);
    } catch (error) {
      console.log("Failed to load top users");
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

  const handleCreatePost = async () => {
    if (!newPostText.trim()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("content", newPostText);
      if (newPostImage) {
        formData.append("image", newPostImage);
      }

      await api.post("/user/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Post created successfully!");
      setNewPostOpen(false);
      setNewPostText("");
      setNewPostImage(null);
      fetchPosts();
    } catch (error) {
      toast.error("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await api.post(`/user/posts/${postId}/like`);
      fetchPosts(); // Refresh to get updated like counts
    } catch (error) {
      toast.error("Failed to like post");
    }
  };

  const handleComment = async (postId, commentText) => {
    try {
      await api.post(`/user/posts/${postId}/comment`, { content: commentText });
      fetchPosts(); // Refresh to get updated comments
    } catch (error) {
      toast.error("Failed to add comment");
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setUserModalOpen(true);
  };

  const handleFollow = async (userId) => {
    try {
      await api.post(`/user/users/${userId}/follow`);
      toast.success("Follow status updated!");
      fetchFollowing();
      // Refresh user details if modal is open
      if (userModalOpen && selectedUser?.id === userId) {
        const res = await api.get(`/user/users/${userId}`);
        setSelectedUser(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to update follow status");
    }
  };
  
  return (
    <div className="px-4 md:px-10 py-10">
      <div className="max-w-7xl mx-auto flex gap-8">
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

          {loading ? (
  <div className="flex justify-center py-10">
    <ClipLoader size={35} color="#14B8A6" />
  </div>
) : (
  <div className="space-y-6">
  {posts.map(post => (
    <PostCard
      key={post.id}
      post={post}
      onLike={handleLike}
      onComment={handleComment}
      onUserClick={handleUserClick}
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
                {topUsers.slice(0, 5).map((user, idx) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                    onClick={() => handleUserClick(user)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-teal-700">
                          {idx + 1}
                        </span>
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
            <p className="text-xs text-gray-500 mb-4">
              People you follow
            </p>
            {!following || following.length === 0 ? (
              <div className="text-center py-4">
                <UserCheck className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-500">Not following anyone yet</p>
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
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.username}
                        </p>
                        <p className="text-xs text-gray-500">
                          Following
                        </p>
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
                disabled={loading || !newPostText.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "Posting..." : "Share Post"}
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
        onFollow={handleFollow}
      />
    </div>
  );
}

export default PackageSocialFeed;