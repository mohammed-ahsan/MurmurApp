import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { murmursAPI, Murmur, PaginationInfo } from '../../services/api';

// Murmurs state interface
interface MurmursState {
  timeline: {
    murmurs: Murmur[];
    pagination: PaginationInfo | null;
    isLoading: boolean;
    error: string | null;
    hasMore: boolean;
  };
  allMurmurs: {
    murmurs: Murmur[];
    pagination: PaginationInfo | null;
    isLoading: boolean;
    error: string | null;
    hasMore: boolean;
  };
  userMurmurs: {
    [userId: string]: {
      murmurs: Murmur[];
      pagination: PaginationInfo | null;
      isLoading: boolean;
      error: string | null;
      hasMore: boolean;
    };
  };
  userLikedMurmurs: {
    [userId: string]: {
      murmurs: Murmur[];
      pagination: PaginationInfo | null;
      isLoading: boolean;
      error: string | null;
      hasMore: boolean;
    };
  };
  currentMurmur: {
    murmur: Murmur | null;
    isLoading: boolean;
    error: string | null;
  };
  createMurmur: {
    isLoading: boolean;
    error: string | null;
  };
  deleteMurmur: {
    isLoading: boolean;
    error: string | null;
  };
  likeMurmur: {
    [murmurId: string]: {
      isLoading: boolean;
      error: string | null;
    };
  };
}

// Initial state
const initialState: MurmursState = {
  timeline: {
    murmurs: [],
    pagination: null,
    isLoading: false,
    error: null,
    hasMore: true,
  },
  allMurmurs: {
    murmurs: [],
    pagination: null,
    isLoading: false,
    error: null,
    hasMore: true,
  },
  userMurmurs: {},
  userLikedMurmurs: {},
  currentMurmur: {
    murmur: null,
    isLoading: false,
    error: null,
  },
  createMurmur: {
    isLoading: false,
    error: null,
  },
  deleteMurmur: {
    isLoading: false,
    error: null,
  },
  likeMurmur: {},
};

// Async thunks
export const fetchTimeline = createAsyncThunk(
  'murmurs/fetchTimeline',
  async ({ page = 1, limit = 10, refresh = false }: { page?: number; limit?: number; refresh?: boolean }, { rejectWithValue }) => {
    try {
      const response = await murmursAPI.getTimeline(page, limit);
      return { ...response, refresh };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllMurmurs = createAsyncThunk(
  'murmurs/fetchAllMurmurs',
  async ({ page = 1, limit = 10, refresh = false }: { page?: number; limit?: number; refresh?: boolean }, { rejectWithValue }) => {
    try {
      const response = await murmursAPI.getAllMurmurs(page, limit);
      return { ...response, refresh };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserMurmurs = createAsyncThunk(
  'murmurs/fetchUserMurmurs',
  async ({ userId, page = 1, limit = 10, refresh = false }: { userId: string; page?: number; limit?: number; refresh?: boolean }, { rejectWithValue }) => {
    try {
      const response = await murmursAPI.getUserMurmurs(userId, page, limit);
      return { ...response, userId, refresh };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserLikedMurmurs = createAsyncThunk(
  'murmurs/fetchUserLikedMurmurs',
  async ({ userId, page = 1, limit = 10, refresh = false }: { userId: string; page?: number; limit?: number; refresh?: boolean }, { rejectWithValue }) => {
    try {
      const response = await murmursAPI.getUserLikedMurmurs(userId, page, limit);
      return { ...response, userId, refresh };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMurmur = createAsyncThunk(
  'murmurs/fetchMurmur',
  async (id: string, { rejectWithValue }) => {
    try {
      const murmur = await murmursAPI.getMurmur(id);
      return murmur;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createMurmur = createAsyncThunk(
  'murmurs/createMurmur',
  async (content: string, { rejectWithValue }) => {
    try {
      const murmur = await murmursAPI.createMurmur(content);
      return murmur;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteMurmur = createAsyncThunk(
  'murmurs/deleteMurmur',
  async (id: string, { rejectWithValue }) => {
    try {
      await murmursAPI.deleteMurmur(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const likeMurmur = createAsyncThunk(
  'murmurs/likeMurmur',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await murmursAPI.likeMurmur(id);
      return { id, ...response };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Create slice
const murmursSlice = createSlice({
  name: 'murmurs',
  initialState,
  reducers: {
    clearMurmursError: (state, action: PayloadAction<{ type?: string; murmurId?: string }>) => {
      const { type, murmurId } = action.payload;
      
      if (type === 'timeline') {
        state.timeline.error = null;
      } else if (type === 'allMurmurs') {
        state.allMurmurs.error = null;
      } else if (type === 'userMurmurs' && murmurId) {
        if (state.userMurmurs[murmurId]) {
          state.userMurmurs[murmurId].error = null;
        }
      } else if (type === 'currentMurmur') {
        state.currentMurmur.error = null;
      } else if (type === 'createMurmur') {
        state.createMurmur.error = null;
      } else if (type === 'deleteMurmur') {
        state.deleteMurmur.error = null;
      } else if (type === 'likeMurmur' && murmurId) {
        if (state.likeMurmur[murmurId]) {
          state.likeMurmur[murmurId].error = null;
        }
      }
    },
    resetUserMurmurs: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      delete state.userMurmurs[userId];
    },
    clearAllMurmurs: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // Fetch timeline
    builder
      .addCase(fetchTimeline.pending, (state) => {
        state.timeline.isLoading = true;
        state.timeline.error = null;
      })
      .addCase(fetchTimeline.fulfilled, (state, action) => {
        state.timeline.isLoading = false;
        const { murmurs, pagination, refresh } = action.payload;
        
        if (refresh) {
          state.timeline.murmurs = murmurs;
        } else {
          state.timeline.murmurs = [...state.timeline.murmurs, ...murmurs];
        }
        
        state.timeline.pagination = pagination;
        state.timeline.hasMore = pagination.hasNextPage;
        state.timeline.error = null;
      })
      .addCase(fetchTimeline.rejected, (state, action) => {
        state.timeline.isLoading = false;
        state.timeline.error = action.payload as string;
      });

    // Fetch all murmurs
    builder
      .addCase(fetchAllMurmurs.pending, (state) => {
        state.allMurmurs.isLoading = true;
        state.allMurmurs.error = null;
      })
      .addCase(fetchAllMurmurs.fulfilled, (state, action) => {
        state.allMurmurs.isLoading = false;
        const { murmurs, pagination, refresh } = action.payload;
        
        if (refresh) {
          state.allMurmurs.murmurs = murmurs;
        } else {
          state.allMurmurs.murmurs = [...state.allMurmurs.murmurs, ...murmurs];
        }
        
        state.allMurmurs.pagination = pagination;
        state.allMurmurs.hasMore = pagination.hasNextPage;
        state.allMurmurs.error = null;
      })
      .addCase(fetchAllMurmurs.rejected, (state, action) => {
        state.allMurmurs.isLoading = false;
        state.allMurmurs.error = action.payload as string;
      });

    // Fetch user murmurs
    builder
      .addCase(fetchUserMurmurs.pending, (state, action) => {
        const userId = action.meta.arg.userId;
        if (!state.userMurmurs[userId]) {
          state.userMurmurs[userId] = {
            murmurs: [],
            pagination: null,
            isLoading: false,
            error: null,
            hasMore: true,
          };
        }
        state.userMurmurs[userId].isLoading = true;
        state.userMurmurs[userId].error = null;
      })
      .addCase(fetchUserMurmurs.fulfilled, (state, action) => {
        const { userId, murmurs, pagination, refresh } = action.payload;
        
        if (!state.userMurmurs[userId]) {
          state.userMurmurs[userId] = {
            murmurs: [],
            pagination: null,
            isLoading: false,
            error: null,
            hasMore: true,
          };
        }
        
        state.userMurmurs[userId].isLoading = false;
        
        if (refresh) {
          state.userMurmurs[userId].murmurs = murmurs;
        } else {
          state.userMurmurs[userId].murmurs = [...state.userMurmurs[userId].murmurs, ...murmurs];
        }
        
        state.userMurmurs[userId].pagination = pagination;
        state.userMurmurs[userId].hasMore = pagination.hasNextPage;
        state.userMurmurs[userId].error = null;
      })
      .addCase(fetchUserMurmurs.rejected, (state, action) => {
        const userId = action.meta.arg.userId;
        if (!state.userMurmurs[userId]) {
          state.userMurmurs[userId] = {
            murmurs: [],
            pagination: null,
            isLoading: false,
            error: null,
            hasMore: true,
          };
        }
        state.userMurmurs[userId].isLoading = false;
        state.userMurmurs[userId].error = action.payload as string;
      });

    // Fetch user liked murmurs
    builder
      .addCase(fetchUserLikedMurmurs.pending, (state, action) => {
        const userId = action.meta.arg.userId;
        if (!state.userLikedMurmurs[userId]) {
          state.userLikedMurmurs[userId] = {
            murmurs: [],
            pagination: null,
            isLoading: false,
            error: null,
            hasMore: true,
          };
        }
        state.userLikedMurmurs[userId].isLoading = true;
        state.userLikedMurmurs[userId].error = null;
      })
      .addCase(fetchUserLikedMurmurs.fulfilled, (state, action) => {
        const { userId, murmurs, pagination, refresh } = action.payload;
        
        if (!state.userLikedMurmurs[userId]) {
          state.userLikedMurmurs[userId] = {
            murmurs: [],
            pagination: null,
            isLoading: false,
            error: null,
            hasMore: true,
          };
        }
        
        state.userLikedMurmurs[userId].isLoading = false;
        
        if (refresh) {
          state.userLikedMurmurs[userId].murmurs = murmurs;
        } else {
          state.userLikedMurmurs[userId].murmurs = [...state.userLikedMurmurs[userId].murmurs, ...murmurs];
        }
        
        state.userLikedMurmurs[userId].pagination = pagination;
        state.userLikedMurmurs[userId].hasMore = pagination.hasNextPage;
        state.userLikedMurmurs[userId].error = null;
      })
      .addCase(fetchUserLikedMurmurs.rejected, (state, action) => {
        const userId = action.meta.arg.userId;
        if (!state.userLikedMurmurs[userId]) {
          state.userLikedMurmurs[userId] = {
            murmurs: [],
            pagination: null,
            isLoading: false,
            error: null,
            hasMore: true,
          };
        }
        state.userLikedMurmurs[userId].isLoading = false;
        state.userLikedMurmurs[userId].error = action.payload as string;
      });

    // Fetch single murmur
    builder
      .addCase(fetchMurmur.pending, (state) => {
        state.currentMurmur.isLoading = true;
        state.currentMurmur.error = null;
      })
      .addCase(fetchMurmur.fulfilled, (state, action) => {
        state.currentMurmur.isLoading = false;
        state.currentMurmur.murmur = action.payload;
        state.currentMurmur.error = null;
      })
      .addCase(fetchMurmur.rejected, (state, action) => {
        state.currentMurmur.isLoading = false;
        state.currentMurmur.error = action.payload as string;
      });

    // Create murmur
    builder
      .addCase(createMurmur.pending, (state) => {
        state.createMurmur.isLoading = true;
        state.createMurmur.error = null;
      })
      .addCase(createMurmur.fulfilled, (state, action) => {
        state.createMurmur.isLoading = false;
        state.createMurmur.error = null;
        
        // Add to timeline and all murmurs at the beginning
        state.timeline.murmurs.unshift(action.payload);
        state.allMurmurs.murmurs.unshift(action.payload);
      })
      .addCase(createMurmur.rejected, (state, action) => {
        state.createMurmur.isLoading = false;
        state.createMurmur.error = action.payload as string;
      });

    // Delete murmur
    builder
      .addCase(deleteMurmur.pending, (state) => {
        state.deleteMurmur.isLoading = true;
        state.deleteMurmur.error = null;
      })
      .addCase(deleteMurmur.fulfilled, (state, action) => {
        state.deleteMurmur.isLoading = false;
        state.deleteMurmur.error = null;
        
        const murmurId = action.payload;
        
        // Remove from all lists
        state.timeline.murmurs = state.timeline.murmurs.filter(m => m.id !== murmurId);
        state.allMurmurs.murmurs = state.allMurmurs.murmurs.filter(m => m.id !== murmurId);
        
        // Remove from user murmurs
        Object.keys(state.userMurmurs).forEach(userId => {
          state.userMurmurs[userId].murmurs = state.userMurmurs[userId].murmurs.filter(m => m.id !== murmurId);
        });
        
        // Remove from user liked murmurs
        Object.keys(state.userLikedMurmurs).forEach(userId => {
          state.userLikedMurmurs[userId].murmurs = state.userLikedMurmurs[userId].murmurs.filter(m => m.id !== murmurId);
        });
        
        // Clear current murmur if it's the one being deleted
        if (state.currentMurmur.murmur?.id === murmurId) {
          state.currentMurmur.murmur = null;
        }
      })
      .addCase(deleteMurmur.rejected, (state, action) => {
        state.deleteMurmur.isLoading = false;
        state.deleteMurmur.error = action.payload as string;
      });

    // Like murmur
    builder
      .addCase(likeMurmur.pending, (state, action) => {
        const murmurId = action.meta.arg;
        state.likeMurmur[murmurId] = { isLoading: true, error: null };
      })
      .addCase(likeMurmur.fulfilled, (state, action) => {
        const { id, isLiked, likesCount } = action.payload;
        
        // Update in timeline
        const timelineMurmur = state.timeline.murmurs.find(m => m.id === id);
        if (timelineMurmur) {
          timelineMurmur.isLikedByUser = isLiked;
          timelineMurmur.likesCount = likesCount;
        }
        
        // Update in all murmurs
        const allMurmur = state.allMurmurs.murmurs.find(m => m.id === id);
        if (allMurmur) {
          allMurmur.isLikedByUser = isLiked;
          allMurmur.likesCount = likesCount;
        }
        
        // Update in user murmurs
        Object.keys(state.userMurmurs).forEach(userId => {
          const userMurmur = state.userMurmurs[userId].murmurs.find(m => m.id === id);
          if (userMurmur) {
            userMurmur.isLikedByUser = isLiked;
            userMurmur.likesCount = likesCount;
          }
        });
        
        // Update in user liked murmurs
        Object.keys(state.userLikedMurmurs).forEach(userId => {
          const likedMurmur = state.userLikedMurmurs[userId].murmurs.find(m => m.id === id);
          if (likedMurmur) {
            likedMurmur.isLikedByUser = isLiked;
            likedMurmur.likesCount = likesCount;
          }
        });
        
        // Update current murmur
        if (state.currentMurmur.murmur?.id === id) {
          state.currentMurmur.murmur.isLikedByUser = isLiked;
          state.currentMurmur.murmur.likesCount = likesCount;
        }
        
        state.likeMurmur[id] = { isLoading: false, error: null };
      })
      .addCase(likeMurmur.rejected, (state, action) => {
        const murmurId = action.meta.arg;
        state.likeMurmur[murmurId] = { isLoading: false, error: action.payload as string };
      });
  },
});

// Export actions
export const { clearMurmursError, resetUserMurmurs, clearAllMurmurs } = murmursSlice.actions;

// Selectors
export const selectTimeline = (state: { murmurs: MurmursState }) => state.murmurs.timeline;
export const selectAllMurmurs = (state: { murmurs: MurmursState }) => state.murmurs.allMurmurs;
export const selectUserMurmurs = (userId: string) => (state: { murmurs: MurmursState }) => state.murmurs.userMurmurs[userId];
export const selectUserLikedMurmurs = (userId: string) => (state: { murmurs: MurmursState }) => state.murmurs.userLikedMurmurs[userId];
export const selectCurrentMurmur = (state: { murmurs: MurmursState }) => state.murmurs.currentMurmur;
export const selectCreateMurmur = (state: { murmurs: MurmursState }) => state.murmurs.createMurmur;
export const selectDeleteMurmur = (state: { murmurs: MurmursState }) => state.murmurs.deleteMurmur;
export const selectLikeMurmur = (murmurId: string) => (state: { murmurs: MurmursState }) => state.murmurs.likeMurmur[murmurId];

// Export reducer
export default murmursSlice.reducer;
