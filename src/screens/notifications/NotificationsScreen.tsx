import React, { useEffect, useCallback } from 'react';
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
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

// Hooks
import { useUI } from '../../store/hooks';

// Types
import { Notification } from '../../types';

const NotificationsScreen = () => {
  const router = useRouter();
  const { notifications, removeNotification, clearNotifications } = useUI();

  useEffect(() => {
    // TODO: Fetch notifications from API
  }, []);

  const handleRefresh = useCallback(() => {
    // TODO: Refresh notifications
  }, []);

  const handleNotificationPress = useCallback((notification: Notification) => {
    // Mark as read and navigate to relevant screen
    if (!notification.isRead) {
      // TODO: Mark notification as read
    }

    if (notification.murmurId) {
      router.push(`/murmur/${notification.murmurId}` as any);
    } else if (notification.userId) {
      router.push(`/user/${notification.userId}` as any);
    }
  }, [router]);

  const handleRemoveNotification = useCallback((notificationId: string) => {
    removeNotification(notificationId);
  }, [removeNotification]);

  const handleClearAll = useCallback(() => {
    clearNotifications();
  }, [clearNotifications]);

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
    const { user, type } = notification;
    
    switch (type) {
      case 'like':
        return `${user.displayName} liked your murmur`;
      case 'follow':
        return `${user.displayName} started following you`;
      case 'reply':
        return `${user.displayName} replied to your murmur`;
      case 'retweet':
        return `${user.displayName} retweeted your murmur`;
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
      case 'retweet':
        return '🔄';
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
        onPress={() => handleRemoveNotification(item.id)}
      >
        <Text style={styles.removeButtonText}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  ), [handleNotificationPress, handleRemoveNotification]);

  const renderEmptyState = useCallback(() => (
    <EmptyState
      title="No Notifications"
      subtitle="When people interact with you, you'll see it here"
      icon="🔔"
    />
  ), []);

  const renderFooter = useCallback(() => (
    <View style={styles.footer}>
      {notifications.length > 0 && (
        <TouchableOpacity
          style={styles.clearAllButton}
          onPress={handleClearAll}
        >
          <Text style={styles.clearAllButtonText}>Clear All</Text>
        </TouchableOpacity>
      )}
    </View>
  ), [notifications.length, handleClearAll]);

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
            refreshing={false}
            onRefresh={handleRefresh}
            tintColor="#1DA1F2"
            colors={['#1DA1F2']}
          />
        }
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
    backgroundColor: '#E0245E',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearAllButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NotificationsScreen;
