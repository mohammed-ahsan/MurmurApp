import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { usersAPI, User, PaginationInfo } from '../../services/api';

// Users state interface
interface UsersState {
  userProfile: {
    [userId: string]: {
      user: User | null;
      isLoading: boolean;
      error: string | null;
    };
  };
  followers: {
    [userId: string]: {
      users: User[];
      pagination: PaginationInfo | null;
      isLoading: boolean;
      error: string | null;
      hasMore: boolean;
    };
  };
  following: {
    [userId: string]: {
      users: User[];
      pagination: PaginationInfo | null;
      isLoading: boolean;
      error: string | null;
      hasMore: boolean;
    };
  };
  search: {
    users: User[];
    pagination: PaginationInfo | null;
    isLoading: boolean;
    error: string | null;
    hasMore: boolean;
    query: string;
  };
  followUnfollow: {
    [userId: string]: {
      isLoading: boolean;
      error: string | null;
    };
  };
}

// Initial state
const initialState: UsersState = {
  userProfile: {},
  followers: {},
  following: {},
  search: {
    users: [],
    pagination: null,
    isLoading: false,
    error: null,
    hasMore: true,
    query: '',
  },
  followUnfollow: {},
};

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  'users/fetchUserProfile',
  async (userId: string, { rejectWithValue }) => {
    try {
      const user = await usersAPI.getUserProfile(userId);
      return { userId, user };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserFollowers = createAsyncThunk(
  'users/fetchUserFollowers',
  async ({ userId, page = 1, limit = 20, refresh = false }: { userId: string; page?: number; limit?: number; refresh?: boolean }, { rejectWithValue }) => {
    try {
      const response = await usersAPI.getUserFollowers(userId, page, limit);
      return { ...response, userId, refresh };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserFollowing = createAsyncThunk(
  'users/fetchUserFollowing',
  async ({ userId, page = 1, limit = 20, refresh = false }: { userId: string; page?: number; limit?: number; refresh?: boolean }, { rejectWithValue }) => {
    try {
      const response = await usersAPI.getUserFollowing(userId, page, limit);
      return { ...response, userId, refresh };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchUsers = createAsyncThunk(
  'users/searchUsers',
  async ({ query, page = 1, limit = 20, refresh = false }: { query: string; page?: number; limit?: number; refresh?: boolean }, { rejectWithValue }) => {
    try {
      const response = await usersAPI.searchUsers(query, page, limit);
      return { ...response, query, refresh };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const followUser = createAsyncThunk(
  'users/followUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await usersAPI.followUser(userId);
      return { userId, ...response };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const unfollowUser = createAsyncThunk(
  'users/unfollowUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await usersAPI.unfollowUser(userId);
      return { userId, ...response };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Create slice
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUsersError: (state: UsersState, action: PayloadAction<{ type?: string; userId?: string }>) => {
      const { type, userId } = action.payload;
      
      if (type === 'userProfile' && userId) {
        if (state.userProfile[userId]) {
          state.userProfile[userId].error = null;
        }
      } else if (type === 'followers' && userId) {
        if (state.followers[userId]) {
          state.followers[userId].error = null;
        }
      } else if (type === 'following' && userId) {
        if (state.following[userId]) {
          state.following[userId].error = null;
        }
      } else if (type === 'search') {
        state.search.error = null;
      } else if (type === 'followUnfollow' && userId) {
        if (state.followUnfollow[userId]) {
          state.followUnfollow[userId].error = null;
        }
      }
    },
    clearSearch: (state: UsersState) => {
      state.search.users = [];
      state.search.pagination = null;
      state.search.hasMore = true;
      state.search.query = '';
      state.search.error = null;
    },
    resetUserProfile: (state: UsersState, action: PayloadAction<string>) => {
      const userId = action.payload;
      delete state.userProfile[userId];
    },
    resetUserFollowers: (state: UsersState, action: PayloadAction<string>) => {
      const userId = action.payload;
      delete state.followers[userId];
    },
    resetUserFollowing: (state: UsersState, action: PayloadAction<string>) => {
      const userId = action.payload;
      delete state.following[userId];
    },
    clearAllUsers: (state: UsersState) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // Fetch user profile
    builder
      .addCase(fetchUserProfile.pending, (state: UsersState, action) => {
        const userId = action.meta.arg;
        if (!state.userProfile[userId]) {
          state.userProfile[userId] = {
            user: null,
            isLoading: false,
            error: null,
          };
        }
        state.userProfile[userId].isLoading = true;
        state.userProfile[userId].error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state: UsersState, action) => {
        const { userId, user } = action.payload;
        if (!state.userProfile[userId]) {
          state.userProfile[userId] = {
            user: null,
            isLoading: false,
            error: null,
          };
        }
        state.userProfile[userId].isLoading = false;
        state.userProfile[userId].user = user;
        state.userProfile[userId].error = null;
      })
      .addCase(fetchUserProfile.rejected, (state: UsersState, action) => {
        const userId = action.meta.arg;
        if (!state.userProfile[userId]) {
          state.userProfile[userId] = {
            user: null,
            isLoading: false,
            error: null,
          };
        }
        state.userProfile[userId].isLoading = false;
        state.userProfile[userId].error = action.payload as string;
      });

    // Fetch user followers
    builder
      .addCase(fetchUserFollowers.pending, (state: UsersState, action) => {
        const userId = action.meta.arg.userId;
        if (!state.followers[userId]) {
          state.followers[userId] = {
            users: [],
            pagination: null,
            isLoading: false,
            error: null,
            hasMore: true,
          };
        }
        state.followers[userId].isLoading = true;
        state.followers[userId].error = null;
      })
      .addCase(fetchUserFollowers.fulfilled, (state: UsersState, action) => {
        const { userId, followers, pagination, refresh } = action.payload;
        
        if (!state.followers[userId]) {
          state.followers[userId] = {
            users: [],
            pagination: null,
            isLoading: false,
            error: null,
            hasMore: true,
          };
        }
        
        state.followers[userId].isLoading = false;
        
        if (refresh) {
          state.followers[userId].users = followers;
        } else {
          state.followers[userId].users = [...state.followers[userId].users, ...followers];
        }
        
        state.followers[userId].pagination = pagination;
        state.followers[userId].hasMore = pagination.hasNextPage;
        state.followers[userId].error = null;
      })
      .addCase(fetchUserFollowers.rejected, (state: UsersState, action) => {
        const userId = action.meta.arg.userId;
        if (!state.followers[userId]) {
          state.followers[userId] = {
            users: [],
            pagination: null,
            isLoading: false,
            error: null,
            hasMore: true,
          };
        }
        state.followers[userId].isLoading = false;
        state.followers[userId].error = action.payload as string;
      });

    // Fetch user following
    builder
      .addCase(fetchUserFollowing.pending, (state: UsersState, action) => {
        const userId = action.meta.arg.userId;
        if (!state.following[userId]) {
          state.following[userId] = {
            users: [],
            pagination: null,
            isLoading: false,
            error: null,
            hasMore: true,
          };
        }
        state.following[userId].isLoading = true;
        state.following[userId].error = null;
      })
      .addCase(fetchUserFollowing.fulfilled, (state: UsersState, action) => {
        const { userId, following, pagination, refresh } = action.payload;
        
        if (!state.following[userId]) {
          state.following[userId] = {
            users: [],
            pagination: null,
            isLoading: false,
            error: null,
            hasMore: true,
          };
        }
        
        state.following[userId].isLoading = false;
        
        if (refresh) {
          state.following[userId].users = following;
        } else {
          state.following[userId].users = [...state.following[userId].users, ...following];
        }
        
        state.following[userId].pagination = pagination;
        state.following[userId].hasMore = pagination.hasNextPage;
        state.following[userId].error = null;
      })
      .addCase(fetchUserFollowing.rejected, (state: UsersState, action) => {
        const userId = action.meta.arg.userId;
        if (!state.following[userId]) {
          state.following[userId] = {
            users: [],
            pagination: null,
            isLoading: false,
            error: null,
            hasMore: true,
          };
        }
        state.following[userId].isLoading = false;
        state.following[userId].error = action.payload as string;
      });

    // Search users
    builder
      .addCase(searchUsers.pending, (state: UsersState, action) => {
        state.search.isLoading = true;
        state.search.error = null;
        state.search.query = action.meta.arg.query;
      })
      .addCase(searchUsers.fulfilled, (state: UsersState, action) => {
        state.search.isLoading = false;
        const { users, pagination, refresh, query } = action.payload;
        
        if (refresh || query !== state.search.query) {
          state.search.users = users;
        } else {
          state.search.users = [...state.search.users, ...users];
        }
        
        state.search.pagination = pagination;
        state.search.hasMore = pagination.hasNextPage;
        state.search.query = query;
        state.search.error = null;
      })
      .addCase(searchUsers.rejected, (state: UsersState, action) => {
        state.search.isLoading = false;
        state.search.error = action.payload as string;
      });

    // Follow user
    builder
      .addCase(followUser.pending, (state: UsersState, action) => {
        const userId = action.meta.arg;
        state.followUnfollow[userId] = { isLoading: true, error: null };
      })
      .addCase(followUser.fulfilled, (state: UsersState, action) => {
        const { userId, isFollowing, followersCount } = action.payload;
        
        // Update follow state
        state.followUnfollow[userId] = { isLoading: false, error: null };
        
        // Update user profile if cached
        if (state.userProfile[userId]?.user) {
          state.userProfile[userId].user!.isFollowing = isFollowing;
          state.userProfile[userId].user!.followersCount = followersCount;
        }
        
        // Update in search results
        state.search.users = state.search.users.map((user: User) => 
          user.id === userId 
            ? { ...user, isFollowing, followersCount }
            : user
        );
        
        // Update in followers lists (if this user is following someone)
        Object.keys(state.following).forEach(followerId => {
          state.following[followerId].users = state.following[followerId].users.map((user: User) =>
            user.id === userId
              ? { ...user, isFollowing, followersCount }
              : user
          );
        });
      })
      .addCase(followUser.rejected, (state: UsersState, action) => {
        const userId = action.meta.arg;
        state.followUnfollow[userId] = { isLoading: false, error: action.payload as string };
      });

    // Unfollow user
    builder
      .addCase(unfollowUser.pending, (state: UsersState, action) => {
        const userId = action.meta.arg;
        state.followUnfollow[userId] = { isLoading: true, error: null };
      })
      .addCase(unfollowUser.fulfilled, (state: UsersState, action) => {
        const { userId, isFollowing, followersCount } = action.payload;
        
        // Update follow state
        state.followUnfollow[userId] = { isLoading: false, error: null };
        
        // Update user profile if cached
        if (state.userProfile[userId]?.user) {
          state.userProfile[userId].user!.isFollowing = isFollowing;
          state.userProfile[userId].user!.followersCount = followersCount;
        }
        
        // Update in search results
        state.search.users = state.search.users.map((user: User) => 
          user.id === userId 
            ? { ...user, isFollowing, followersCount }
            : user
        );
        
        // Update in followers lists
        Object.keys(state.following).forEach(followerId => {
          state.following[followerId].users = state.following[followerId].users.map((user: User) =>
            user.id === userId
              ? { ...user, isFollowing, followersCount }
              : user
          );
        });
      })
      .addCase(unfollowUser.rejected, (state: UsersState, action) => {
        const userId = action.meta.arg;
        state.followUnfollow[userId] = { isLoading: false, error: action.payload as string };
      });
  },
});

// Export actions
export const { 
  clearUsersError, 
  clearSearch, 
  resetUserProfile, 
  resetUserFollowers, 
  resetUserFollowing,
  clearAllUsers
} = usersSlice.actions;

// Selectors
export const selectUserProfile = (userId: string) => (state: { users: UsersState }) => state.users.userProfile[userId];
export const selectUserFollowers = (userId: string) => (state: { users: UsersState }) => state.users.followers[userId];
export const selectUserFollowing = (userId: string) => (state: { users: UsersState }) => state.users.following[userId];
export const selectSearchUsers = (state: { users: UsersState }) => state.users.search;
export const selectFollowUnfollow = (userId: string) => (state: { users: UsersState }) => state.users.followUnfollow[userId];

// Export reducer
export default usersSlice.reducer;
