import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, createPost, likePost , unLikePost} from "../store/slices/postSlice";
import { ThumbsUp, ThumbsDown, Share2 } from "lucide-react";
import "../styles/feed.css";

const Feed = () => {
  const dispatch = useDispatch();
  const { posts, loading } = useSelector((state) => state.posts);
  const [newPost, setNewPost] = useState("");

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    await dispatch(createPost({ text: newPost }));
    setNewPost("");
  };

  const handleLike = (postId) => {
    dispatch(likePost(postId));
  };

  const handleUnLike = (postId) => {
    dispatch(unLikePost(postId));
  };

  // Random font family function with cool fonts
  const getRandomFont = () => {
    const fonts = [
      "'Pacifico', cursive",
      "'Orbitron', sans-serif",
      "'Dancing Script', cursive",
      "'Bebas Neue', sans-serif",
    ];
    return fonts[Math.floor(Math.random() * fonts.length)];
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="feed-container">
      {/* Post Creation Form */}
      <div className="card post-form">
        <form onSubmit={handleCreatePost}>
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="What's on your mind?"
            className="form-input"
          />
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Post
            </button>
          </div>
        </form>
      </div>

      {/* Posts List */}
      <div className="posts-list">
        {posts.map((post) => {
          // Dynamic text styling based on length
          const textLength = post.text.length;
          const textStyle = textLength < 25 ? "short-text" : "long-text";

          // Random background color with gradient
          const bgColors = [
            "linear-gradient(135deg, #f9ebee, #e8dede)",
            "linear-gradient(135deg, #e8f4f8, #d1e8f0)",
            "linear-gradient(135deg, #fef9e7, #f7e8c8)",
            "linear-gradient(135deg, #e9f7ef, #d2e9dc)",
          ];
          const randomBg = bgColors[Math.floor(Math.random() * bgColors.length)];

          // Random font family
          const fontFamily = getRandomFont();

          return (
            <div
              key={post?._id}
              className="card post"
              style={{ background: randomBg }}
            >
              {/* Post Header (Top Right) */}
              <div className="post-header">
                <div className="post-user">
                  <span className="post-username">
                    {post.user?.name || "Unknown User"}
                  </span>
                  <img
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${post.user?.name || "Anonymous"}`}
                    alt={post.user?.name || "Unknown User"}
                    className="post-avatar"
                  />
                </div>
                <div className="post-date">
                  {post?._id}
                </div>
                <div className="post-date">
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Post Content */}
              <div
                className={`post-content ${textStyle}`}
                style={{ fontFamily }}
              >
                {post?.text}
                {post?.image && (
                  <img
                    src={`http://localhost:5000/${post.image}`}
                    alt="Post"
                    className="post-img"
                  />
                )}
              </div>

              {/* Post Actions */}
              <div className="post-actions">
                <button
                  onClick={() => handleLike(post?._id)}
                  className={`action-btn like-btn ${post?.liked ? "liked" : ""}`}
                >
                  <ThumbsUp
                    size={20}
                    fill={post?.liked ? "#fff" : "none"}
                    stroke={post?.liked ? "#fff" : "#34495e"}
                  />
                  <span className="count">{post?.likes?.length || 0}</span>
                </button>
                <button
                 onClick={() => handleUnLike(post?._id)}
                 className="action-btn dislike-btn">
                  <ThumbsDown size={20} />
                  <span className="count">{post?.unlikes?.length || 0}</span>
                </button>
                <button className="action-btn share-btn">
                  <Share2 size={20} />
                  <span>Share</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Feed;