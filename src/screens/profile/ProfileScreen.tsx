import React, { useEffect, useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// Components
import MurmurItem from '../../components/murmur/MurmurItem';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

// Hooks
import { useAuth, useMurmurs } from '../../store/hooks';

// Types
import { Murmur } from '../../types';

const ProfileScreen = () => {
  const [activeTab, setActiveTab] = useState<'murmurs' | 'likes'>('murmurs');
  
  const router = useRouter();
  const { user, logout } = useAuth();
  const { 
    userMurmurs: allUserMurmurs, 
    userLikedMurmurs: allUserLikedMurmurs,
    fetchUserMurmurs, 
    fetchUserLikedMurmurs,
    deleteMurmur, 
    likeMurmur 
  } = useMurmurs();
  
  // Get the current user's murmurs from the state
  const userMurmurs = user?.id ? allUserMurmurs[user.id] : undefined;
  const userLikedMurmurs = user?.id ? allUserLikedMurmurs[user.id] : undefined;

  useEffect(() => {
    if (user) {
      fetchUserMurmurs({ userId: user.id, page: 1, limit: 10, refresh: true });
    }
  }, [user?.id]); // Only depend on user.id, not the fetchUserMurmurs function

  // Fetch liked murmurs when switching to likes tab
  useEffect(() => {
    if (user && activeTab === 'likes' && !userLikedMurmurs) {
      fetchUserLikedMurmurs({ userId: user.id, page: 1, limit: 10, refresh: true });
    }
  }, [activeTab, user?.id]);

  const handleRefresh = useCallback(() => {
    if (user) {
      if (activeTab === 'murmurs') {
        fetchUserMurmurs({ userId: user.id, page: 1, limit: 10, refresh: true });
      } else {
        fetchUserLikedMurmurs({ userId: user.id, page: 1, limit: 10, refresh: true });
      }
    }
  }, [user?.id, activeTab]); // Only depend on user.id and activeTab

  const handleLoadMore = useCallback(() => {
    if (user) {
      if (activeTab === 'murmurs' && userMurmurs && !userMurmurs.isLoading && userMurmurs.hasMore && userMurmurs.pagination) {
        fetchUserMurmurs({
          userId: user.id,
          page: userMurmurs.pagination.page + 1,
          limit: 10,
          refresh: false,
        });
      } else if (activeTab === 'likes' && userLikedMurmurs && !userLikedMurmurs.isLoading && userLikedMurmurs.hasMore && userLikedMurmurs.pagination) {
        fetchUserLikedMurmurs({
          userId: user.id,
          page: userLikedMurmurs.pagination.page + 1,
          limit: 10,
          refresh: false,
        });
      }
    }
  }, [user?.id, activeTab, userMurmurs?.isLoading, userMurmurs?.hasMore, userMurmurs?.pagination, userLikedMurmurs?.isLoading, userLikedMurmurs?.hasMore, userLikedMurmurs?.pagination]);

  const handleLike = useCallback(async (murmurId: string) => {
    try {
      await likeMurmur(murmurId);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to like murmur');
    }
  }, [likeMurmur]);

  const handleDelete = useCallback((murmurId: string) => {
    Alert.alert(
      'Delete Murmur',
      'Are you sure you want to delete this murmur? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMurmur(murmurId);
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete murmur');
            }
          },
        },
      ]
    );
  }, [deleteMurmur]);

  const handleMurmurPress = useCallback((murmur: Murmur) => {
    router.push(`/murmur/${murmur.id}` as any);
  }, [router]);

  const handleUserPress = useCallback((userId: string) => {
    // Don't navigate if it's the current user
    if (userId !== user?.id) {
      router.push(`/user/${userId}` as any);
    }
  }, [router, user?.id]);


  const handleLogout = useCallback(() => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  }, [logout]);

  const renderMurmur = useCallback(({ item }: { item: Murmur }) => (
    <MurmurItem
      murmur={item}
      onLike={handleLike}
      onDelete={handleDelete}
      onMurmurPress={handleMurmurPress}
      onUserPress={handleUserPress}
    />
  ), [handleLike, handleDelete, handleMurmurPress, handleUserPress]);

  const renderEmptyState = useCallback(() => {
    if (activeTab === 'murmurs') {
      return (
        <EmptyState
          title="No Murmurs Yet"
          subtitle="Share your thoughts with the world"
          actionText="Create Your First Murmur"
          onAction={() => router.push('/modal')}
        />
      );
    } else {
      return (
        <EmptyState
          title="No Liked Murmurs"
          subtitle="Murmurs you like will appear here"
          icon="❤️"
        />
      );
    }
  }, [activeTab, router]);

  const renderFooter = useCallback(() => {
    const isLoading = activeTab === 'murmurs' ? userMurmurs?.isLoading : userLikedMurmurs?.isLoading;
    if (isLoading) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color="#1DA1F2" />
        </View>
      );
    }
    return null;
  }, [activeTab, userMurmurs?.isLoading, userLikedMurmurs?.isLoading]);

  if (!user) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={(activeTab === 'murmurs' ? userMurmurs?.isLoading : userLikedMurmurs?.isLoading) || false}
            onRefresh={handleRefresh}
            tintColor="#1DA1F2"
            colors={['#1DA1F2']}
          />
        }
      >
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
          
          <View style={styles.userInfo}>
            <Text style={styles.displayName}>{user.displayName}</Text>
            <Text style={styles.username}>@{user.username}</Text>
            {user.bio && <Text style={styles.bio}>{user.bio}</Text>}
          </View>

          <View style={styles.headerActions}>

            
            <TouchableOpacity
              style={[styles.actionButton, styles.logoutButton]}
              onPress={handleLogout}
            >
              <Text style={[styles.actionButtonText, styles.logoutButtonText]}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.murmursCount}</Text>
            <Text style={styles.statLabel}>Murmurs</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.followingCount}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.followersCount}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'murmurs' && styles.activeTab]}
            onPress={() => setActiveTab('murmurs')}
          >
            <Text style={[styles.tabText, activeTab === 'murmurs' && styles.activeTabText]}>
              Murmurs
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'likes' && styles.activeTab]}
            onPress={() => setActiveTab('likes')}
          >
            <Text style={[styles.tabText, activeTab === 'likes' && styles.activeTabText]}>
              Likes
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {activeTab === 'murmurs' ? (
          userMurmurs?.murmurs && userMurmurs.murmurs.length > 0 ? (
            userMurmurs.murmurs.map((murmur: Murmur) => (
              <MurmurItem
                key={murmur.id}
                murmur={murmur}
                onLike={handleLike}
                onDelete={handleDelete}
                onMurmurPress={handleMurmurPress}
                onUserPress={handleUserPress}
              />
            ))
          ) : (
            renderEmptyState()
          )
        ) : (
          userLikedMurmurs?.murmurs && userLikedMurmurs.murmurs.length > 0 ? (
            userLikedMurmurs.murmurs.map((murmur: Murmur) => (
              <MurmurItem
                key={murmur.id}
                murmur={murmur}
                onLike={handleLike}
                onDelete={handleDelete}
                onMurmurPress={handleMurmurPress}
                onUserPress={handleUserPress}
              />
            ))
          ) : (
            renderEmptyState()
          )
        )}

        {renderFooter()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1DA1F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    alignSelf: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  displayName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#14171A',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: '#657786',
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: '#14171A',
    textAlign: 'center',
    lineHeight: 20,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    backgroundColor: '#1DA1F2',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 100,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#E0245E',
  },
  logoutButtonText: {
    color: '#ffffff',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#14171A',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#657786',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#1DA1F2',
  },
  tabText: {
    fontSize: 16,
    color: '#657786',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#1DA1F2',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default ProfileScreen;
