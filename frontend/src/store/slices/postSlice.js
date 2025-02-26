import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { postApi } from '../../services/api';
import { toast } from 'react-hot-toast';

// Fetch all posts
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await postApi.getPosts();
  return response.data;
});

// Create a new post
export const createPost = createAsyncThunk(
  'posts/createPost',
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const response = await postApi.createPost(data);
      // Refetch all posts after creating a new post
      await dispatch(fetchPosts()).unwrap();
      toast.success('Post created successfully!');
      return response.data; // Still return the created post data if needed
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create post');
    }
  }
);

// Like a post
export const likePost = createAsyncThunk(
  'posts/likePost',
  async (postId, { dispatch }) => {
    const response = await postApi.likePost(postId);
    // Refetch all posts after liking
    await dispatch(fetchPosts()).unwrap();
    // toast.success('Post liked!');
    return response.data; // Expecting updated post data
  }
);

// Unlike a post
export const unLikePost = createAsyncThunk(
  'posts/unLikePost',
  async (postId, { dispatch }) => {
    const response = await postApi.unlikePost(postId);
    // Refetch all posts after unliking
    await dispatch(fetchPosts()).unwrap();
    // toast.success('Post unliked!');
    return response.data; // Expecting updated post data
  }
);

const postSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create Post
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state) => {
        state.loading = false;
        // No need to update state.posts manually; fetchPosts handles it
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Like Post
      .addCase(likePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(likePost.fulfilled, (state) => {
        state.loading = false;
        // No need to update state.posts manually; fetchPosts handles it
      })
      .addCase(likePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        toast.error('Failed to like post');
      })
      // Unlike Post
      .addCase(unLikePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unLikePost.fulfilled, (state) => {
        state.loading = false;
        // No need to update state.posts manually; fetchPosts handles it
      })
      .addCase(unLikePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        toast.error('Failed to unlike post');
      });
  },
});

export default postSlice.reducer;