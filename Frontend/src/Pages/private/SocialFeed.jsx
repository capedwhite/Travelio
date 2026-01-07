const initialPosts = [
  {
    id: 1,
    user: {
      name: "Aarav Shrestha",
      avatar: "/images/profile.png",
    },
    content: "Everest Base Camp trek was life-changing 🏔️",
    image: "/images/loginbg.png",
    likes: 12,
    likedByMe: false,
    comments: [
      { id: 1, user: "Sita", text: "Looks amazing!" },
      { id: 2, user: "Ramesh", text: "On my bucket list 🔥" },
    ],
  },
    {
    id: 2,
    user: {
      name: "Aarav Shrestha",
      avatar: "/images/profile.png",
    },
    content: "Everest Base Camp trek was life-changing 🏔️",
    image: "/images/loginbg.png",
    likes: 12,
    likedByMe: false,
    comments: [
      { id: 1, user: "Sita", text: "Looks amazing!" },
      { id: 2, user: "Ramesh", text: "On my bucket list 🔥" },
    ],
  },
    {
    id: 3,
    user: {
      name: "Aarav Shrestha",
      avatar: "/images/profile.png",
    },
    content: "Everest Base Camp trek was life-changing 🏔️",
    image: "/images/loginbg.png",
    likes: 12,
    likedByMe: false,
    comments: [
      { id: 1, user: "Sita", text: "Looks amazing!" },
      { id: 2, user: "Ramesh", text: "On my bucket list 🔥" },
    ],
  },
];
import { useState } from "react";
import { Heart, MessageCircle, Plus } from "lucide-react";
function PostCard({ post, onLike, onComment }) {
  const [commentText, setCommentText] = useState("");

  return (
    <div className="bg-white border rounded-lg shadow-sm ">

      {/* HEADER */}
      <div className="flex items-center gap-3 p-4">
        <img src={post.user.avatar} className="w-10 h-10 rounded-full" />
        <span className="font-semibold">{post.user.name}</span>
      </div>

      {/* CONTENT */}
      <p className="px-4 pb-2">{post.content}</p>

      {post.image && (
        <img src={post.image} className="w-full max-h-96 object-cover" />
      )}

      {/* ACTIONS */}
      <div className="flex items-center gap-4 px-4 py-2">
        <button onClick={onLike} className="flex items-center gap-1">
          <Heart
            className={`w-5 h-5 ${
              post.likedByMe ? "fill-red-500 text-red-500" : ""
            }`}
          />
          {post.likes}
        </button>

        <MessageCircle className="w-5 h-5" />
      </div>

      {/* COMMENTS */}
      <div className="px-4 space-y-1">
        {post.comments.map(c => (
          <p key={c.id} className="text-sm">
            <span className="font-semibold">{c.user}</span> {c.text}
          </p>
        ))}
      </div>

      {/* ADD COMMENT */}
      <div className="flex gap-2 p-4">
        <input
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 border rounded px-2 py-1"
        />
        <button
          onClick={() => {
            onComment(post.id, commentText);
            setCommentText("");
          }}
          className="text-green-600 font-semibold"
        >
          Post
        </button>
      </div>

    </div>
  );
}

 function PackageSocialFeed() {
  const [posts, setPosts] = useState(initialPosts);
  const [newPostOpen, setNewPostOpen] = useState(false);
  const [newPostText, setNewPostText] = useState("");


  const toggleLike = (postId) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? {
            ...post,
            likedByMe: !post.likedByMe,
            likes: post.likedByMe ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  // 💬 Add comment
  const addComment = (postId, commentText) => {
    if (!commentText.trim()) return;

    setPosts(posts.map(post =>
      post.id === postId
        ? {
            ...post,
            comments: [
              ...post.comments,
              { id: Date.now(), user: "You", text: commentText }
            ]
          }
        : post
    ));
  };

  return (
    <div className="relative max-w-2xl mx-auto space-y-6 py-6 mt-[5%] pb-10">

      {/* POSTS */}
      {posts.map(post => (
        <PostCard
          key={post.id}
          post={post}
          onLike={() => toggleLike(post.id)}
          onComment={addComment}
        />
      ))}

      {/* FLOATING CREATE POST BUTTON */}
      <button
        onClick={() => setNewPostOpen(true)}
        className="fixed right-6 bottom-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700"
      >
        <Plus />
      </button>

      {/* CREATE POST MODAL */}
      {newPostOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-3">Share your experience</h2>

            <textarea
              className="w-full border rounded p-2"
              rows={4}
              placeholder="How was your trip?"
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
            />

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setNewPostOpen(false)}>Cancel</button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={() => {
                  setPosts([
                    {
                      id: Date.now(),
                      user: { name: "You", avatar: "/images/profile.png" },
                      content: newPostText,
                      image: null,
                      likes: 0,
                      likedByMe: false,
                      comments: [],
                    },
                    ...posts,
                  ]);
                  setNewPostText("");
                  setNewPostOpen(false);
                }}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
export default PackageSocialFeed