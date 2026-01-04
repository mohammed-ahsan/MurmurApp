import React, { useEffect, useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// Components
import EmptyState from '../../components/common/EmptyState';

// Hooks
import { useNotifications } from '../../store/hooks';

// Types
import { Notification } from '../../types';

const NotificationsScreen = () => {
  const router = useRouter();
  const { 
    notifications, 
    isLoading, 
    hasMore, 
    nextCursor,
    fetchNotifications, 
    fetchUnreadCount,
    markAsRead, 
    markAllAsRead,
    deleteNotification 
  } = useNotifications();

  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
  }, []);

  const loadNotifications = async () => {
    try {
      await fetchNotifications();
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const loadUnreadCount = async () => {
    try {
      await fetchUnreadCount();
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadNotifications(), loadUnreadCount()]);
    setRefreshing(false);
  };

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore || !nextCursor) return;
    
    setLoadingMore(true);
    try {
      await fetchNotifications({ cursor: nextCursor });
    } catch (error) {
      console.error('Failed to load more notifications:', error);
    }
    setLoadingMore(false);
  };

  const handleNotificationPress = async (notification: Notification) => {
    // Mark as read
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }

    // Navigate based on notification type
    if (notification.type === 'like' || notification.type === 'reply') {
      if (notification.murmurId) {
        router.push(`/murmur/${notification.murmurId}` as any);
      }
    } else if (notification.type === 'follow') {
      router.push(`/user/${notification.actor.id}` as any);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await deleteNotification(notificationId);
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    
    return new Date(date).toLocaleDateString();
  };

  const getNotificationText = (notification: Notification) => {
    const { actor, type } = notification;
    
    switch (type) {
      case 'like':
        return `${actor.displayName} liked your murmur`;
      case 'follow':
        return `${actor.displayName} started following you`;
      case 'reply':
        return `${actor.displayName} replied to your murmur`;
      default:
        return 'New notification';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return '❤️';
      case 'follow':
        return '👤';
      case 'reply':
        return '💬';
      default:
        return '🔔';
    }
  };

  const renderNotification = useCallback(({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        !item.isRead && styles.unreadNotification
      ]}
      onPress={() => handleNotificationPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.notificationIcon}>
        <Text style={styles.iconText}>
          {getNotificationIcon(item.type)}
        </Text>
      </View>
      
      <View style={styles.notificationContent}>
        <Text style={styles.notificationText}>
          {getNotificationText(item)}
        </Text>
        <Text style={styles.timestamp}>
          {formatDate(item.createdAt)}
        </Text>
        {item.murmur && (
          <Text style={styles.murmurPreview} numberOfLines={2}>
            {item.murmur.content}
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleDeleteNotification(item.id)}
      >
        <Text style={styles.removeButtonText}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  ), []);

  const renderEmptyState = useCallback(() => (
    <EmptyState
      title="No Notifications"
      subtitle="When people interact with you, you'll see it here"
      icon="🔔"
    />
  ), []);

  const renderFooter = useCallback(() => {
    if (loadingMore) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color="#1DA1F2" />
        </View>
      );
    }
    
    return (
      <View style={styles.footer}>
        {notifications.length > 0 && (
          <TouchableOpacity
            style={styles.clearAllButton}
            onPress={handleMarkAllAsRead}
          >
            <Text style={styles.clearAllButtonText}>Mark All as Read</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }, [notifications.length, loadingMore]);

  if (isLoading && notifications.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1DA1F2" />
        </View>
      </SafeAreaView>
    );
  }

  if (notifications.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        {renderEmptyState()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#1DA1F2"
            colors={['#1DA1F2']}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
    alignItems: 'center',
  },
  unreadNotification: {
    backgroundColor: '#F7F9FA',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1DA1F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 20,
  },
  notificationContent: {
    flex: 1,
  },
  notificationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#14171A',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#657786',
    marginBottom: 4,
  },
  murmurPreview: {
    fontSize: 14,
    color: '#657786',
    lineHeight: 20,
  },
  removeButton: {
    padding: 8,
  },
  removeButtonText: {
    fontSize: 16,
    color: '#657786',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E1E8ED',
  },
  clearAllButton: {
    backgroundColor: '#1DA1F2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
  },
  clearAllButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footerLoader: {
    padding: 16,
    alignItems: 'center',
  },
});

export default NotificationsScreen;
