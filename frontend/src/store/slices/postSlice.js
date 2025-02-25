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
      // After creating the post, refetch all posts
      await dispatch(fetchPosts()).unwrap();
      return response.data; // Still return the created post data if needed elsewhere
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create post');
    }
  }
);

// Like a post
export const likePost = createAsyncThunk(
  'posts/likePost',
  async (postId) => {
    const response = await postApi.likePost(postId);
    return response.data; // Expecting updated post data
  }
);

// Unlike a post
export const unLikePost = createAsyncThunk(
  'posts/unLikePost',
  async (postId) => {
    const response = await postApi.unlikePost(postId);
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
      .addCase(createPost.fulfilled, (state) => {
        state.loading = false; // Reset loading state
        // No need to manually update state.posts here since fetchPosts will handle it
        toast.success('Post created successfully!');
      })
      .addCase(createPost.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Like Post
      .addCase(likePost.fulfilled, (state, action) => {
        const updatedPost = action.payload;
        const index = state.posts.findIndex((post) => post.id === updatedPost.id);
        if (index !== -1) {
          state.posts[index] = updatedPost; // Update the liked post
        }
        // toast.success('Post liked!');
      })
      .addCase(likePost.rejected, (state, action) => {
        state.error = action.error.message;
        // toast.error('Failed to like post');
      })
      // Unlike Post
      .addCase(unLikePost.fulfilled, (state, action) => {
        const updatedPost = action.payload;
        const index = state.posts.findIndex((post) => post.id === updatedPost.id);
        if (index !== -1) {
          state.posts[index] = updatedPost; // Update the unliked post
        }
        // toast.success('Post unliked!');
      })
      .addCase(unLikePost.rejected, (state, action) => {
        state.error = action.error.message;
        toast.error('Failed to unlike post');
      });
  },
});

export default postSlice.reducer;