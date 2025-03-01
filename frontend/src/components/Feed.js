import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, createPost, likePost, unLikePost } from "../store/slices/postSlice";
import { ThumbsUp, ThumbsDown, Share2 } from "lucide-react";
import "../styles/feed.css";

const Feed = () => {
  const dispatch = useDispatch();
  const { posts, loading } = useSelector((state) => state.posts);
  const [newPost, setNewPost] = useState("");
  const [userId, setUserId] = useState();

  // Check localStorage for user data on initial render
  useEffect(() => {
    let userData = localStorage.getItem("user");
     userData = JSON.parse(userData)
    setUserId(userData?.id || userData?._id); // Use '_id' if that's the key in your user object
  }, []);

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
      <div className="feed-layout">
        {/* Left Side: Post Creation Form */}
        <div className="feed-left">
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
        </div>

        {/* Right Side: Posts List */}
        <div className="feed-right">
          <div className="posts-list">
            {posts.map((post) => {
              const textLength = post.text.length;
              const textStyle = textLength < 25 ? "short-text" : "long-text";
              const bgColors = [
                "linear-gradient(135deg, #f9ebee, #e8dede)",
                "linear-gradient(135deg, #e8f4f8, #d1e8f0)",
                "linear-gradient(135deg, #fef9e7, #f7e8c8)",
                "linear-gradient(135deg, #e9f7ef, #d2e9dc)",
              ];
              const randomBg = bgColors[Math.floor(Math.random() * bgColors.length)];
              const fontFamily = getRandomFont();

              // Check if current user has liked or unliked the post
              const isLikedByUser = post?.likes?.some((like) => like.user === userId);
              const isUnlikedByUser = post?.unlikes?.some((unlike) => unlike.user === userId);

              return (
                <div
                  key={post?._id}
                  className="card post"
                  style={{ background: randomBg }}
                >
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
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className={`post-content ${textStyle}`} style={{ fontFamily }}>
                    {post?.text}
                  </div>

                  <div className="post-actions">
                    <button
                      onClick={() => handleLike(post?._id)}
                      className={`action-btn like-btn ${isLikedByUser ? "liked" : ""}`}
                    >
                      <ThumbsUp
                        size={20}
                        fill={isLikedByUser ? "#000000" : "none"} // Black fill if liked by user
                        stroke={isLikedByUser ? "#000000" : "#34495e"} // Black stroke if liked
                      />
                      <span className="count">{post?.likes?.length || 0}</span>
                    </button>
                    <button
                      onClick={() => handleUnLike(post?._id)}
                      className={`action-btn dislike-btn ${isUnlikedByUser ? "unliked" : ""}`}
                    >
                      <ThumbsDown
                        size={20}
                        fill={isUnlikedByUser ? "#1a1a1a" : "none"} // Dark gray fill if unliked by user
                        stroke={isUnlikedByUser ? "#1a1a1a" : "#34495e"} // Dark gray stroke if unliked
                      />
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
      </div>
    </div>
  );
};

export default Feed;