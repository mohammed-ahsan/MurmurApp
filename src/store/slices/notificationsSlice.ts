import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as notificationsAPI from '../../services/api';
import { Notification } from '../../types';

interface NotificationsState {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  unreadCount: number;
  nextCursor: string | null;
}

const initialState: NotificationsState = {
  notifications: [],
  isLoading: false,
  error: null,
  hasMore: true,
  unreadCount: 0,
  nextCursor: null,
};

// Async thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async ({ cursor }: { cursor?: string } = {}, { rejectWithValue }) => {
    try {
      const response = await notificationsAPI.getNotifications(cursor);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch notifications');
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'notifications/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationsAPI.getUnreadCount();
      return response.count;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch unread count');
    }
  }
);

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId: string, { rejectWithValue }) => {
    try {
      await notificationsAPI.markNotificationAsRead(notificationId);
      return notificationId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to mark notification as read');
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      await notificationsAPI.markAllNotificationsAsRead();
      return;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to mark all as read');
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (notificationId: string, { rejectWithValue }) => {
    try {
      await notificationsAPI.deleteNotification(notificationId);
      return notificationId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete notification');
    }
  }
);

// Slice
const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearNotifications: (state) => {
      state.notifications = [];
      state.hasMore = true;
      state.nextCursor = null;
      state.error = null;
      state.unreadCount = 0;
    },
    clearError: (state) => {
      state.error = null;
    },
    incrementUnreadCount: (state) => {
      state.unreadCount += 1;
    },
  },
  extraReducers: (builder) => {
    // Fetch notifications
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        const isLoadMore = !!action.meta.arg.cursor;
        
        if (isLoadMore) {
          state.notifications = [...state.notifications, ...action.payload.data];
        } else {
          state.notifications = action.payload.data;
        }
        
        state.hasMore = action.payload.hasMore;
        state.nextCursor = action.payload.nextCursor;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch unread count
    builder
      .addCase(fetchUnreadCount.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      .addCase(fetchUnreadCount.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Mark as read
    builder
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notificationId = action.payload;
        const notification = state.notifications.find(n => n.id === notificationId);
        if (notification && !notification.isRead) {
          notification.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      });

    // Mark all as read
    builder
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications.forEach(n => {
          n.isRead = true;
        });
        state.unreadCount = 0;
      });

    // Delete notification
    builder
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const notificationId = action.payload;
        const notification = state.notifications.find(n => n.id === notificationId);
        if (notification && !notification.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications = state.notifications.filter(n => n.id !== notificationId);
      });
  },
});

// Export actions
export const { clearNotifications, clearError, incrementUnreadCount } = notificationsSlice.actions;

// Selectors
export const selectNotifications = (state: { notifications: NotificationsState }) => 
  state.notifications.notifications;
export const selectNotificationsLoading = (state: { notifications: NotificationsState }) => 
  state.notifications.isLoading;
export const selectNotificationsError = (state: { notifications: NotificationsState }) => 
  state.notifications.error;
export const selectHasMoreNotifications = (state: { notifications: NotificationsState }) => 
  state.notifications.hasMore;
export const selectUnreadCount = (state: { notifications: NotificationsState }) => 
  state.notifications.unreadCount;
export const selectNextCursor = (state: { notifications: NotificationsState }) => 
  state.notifications.nextCursor;

// Export reducer
export default notificationsSlice.reducer;
