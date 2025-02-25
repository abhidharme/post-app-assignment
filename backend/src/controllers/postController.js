const Post = require("../models/Post");

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user.id; // Get user ID from auth middleware

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const image = req.file ? req.file.path : null;

    const newPost = new Post({
      text,
      image,
      user: userId, // Store user ID
    });

    await newPost.save(); // Save the post correctly

    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email"); // Populate user details
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Like/Unlike Post
exports.likeUnlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const userId = req.user.id;
    const likedIndex = post.likes.findIndex((like) => like.user.toString() === userId);
    const unlikedIndex = post.unlikes.findIndex((unlike) => unlike.user.toString() === userId);

    if (likedIndex > -1) {
      // Unlike if already liked
      post.likes.splice(likedIndex, 1);
    } else {
      // Like the post
      post.likes.push({ user: userId });

      // Remove dislike if exists
      if (unlikedIndex > -1) {
        post.unlikes.splice(unlikedIndex, 1);
      }
    }

    await post.save();
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Dislike/Undislike Post
exports.unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req?.params?.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const userId = req.user.id;
    const likedIndex = post.likes.findIndex((like) => like.user.toString() === userId);
    const unlikedIndex = post.unlikes.findIndex((unlike) => unlike.user.toString() === userId);

    if (unlikedIndex > -1) {
      // Remove dislike
      post.unlikes.splice(unlikedIndex, 1);
    } else {
      // Dislike the post
      post.unlikes.push({ user: userId });

      // Remove like if exists
      if (likedIndex > -1) {
        post.likes.splice(likedIndex, 1);
      }
    }

    await post.save();
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
