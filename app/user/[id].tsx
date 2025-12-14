import React, { useEffect, useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Components
import MurmurItem from '../../src/components/murmur/MurmurItem';
import LoadingSpinner from '../../src/components/common/LoadingSpinner';
import EmptyState from '../../src/components/common/EmptyState';

// Hooks
import { useMurmurs, useAuth, useUsers } from '../../src/store/hooks';

// Types
import { Murmur } from '../../src/types';

export default function UserProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { userMurmurs, fetchUserMurmurs, likeMurmur, deleteMurmur } = useMurmurs();
  const { userProfile, fetchUserProfile, followUser, unfollowUser } = useUsers();
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      fetchUserProfile(id);
      fetchUserMurmurs({ userId: id, page: 1, limit: 10, refresh: true });
    }
  }, [id, fetchUserProfile, fetchUserMurmurs]);

  const handleRefresh = useCallback(async () => {
    if (!id) return;
    
    setIsRefreshing(true);
    try {
      await Promise.all([
        fetchUserProfile(id),
        fetchUserMurmurs({ userId: id, page: 1, limit: 10, refresh: true }),
      ]);
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [id, fetchUserProfile, fetchUserMurmurs]);

  const handleLoadMore = useCallback(() => {
    if (!id || !userMurmurs.hasMore || userMurmurs.isLoading) return;
    
    const nextPage = userMurmurs.pagination?.currentPage ? userMurmurs.pagination.currentPage + 1 : 2;
    fetchUserMurmurs({
      userId: id,
      page: nextPage,
      limit: 10,
      refresh: false,
    });
  }, [id, fetchUserMurmurs, userMurmurs.hasMore, userMurmurs.isLoading, userMurmurs.pagination]);

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

  const handleFollow = useCallback(async () => {
    if (!userProfile?.user) return;
    
    try {
      if (userProfile.user.isFollowing) {
        await unfollowUser(userProfile.user.id);
      } else {
        await followUser(userProfile.user.id);
      }
      await fetchUserProfile(id);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to follow/unfollow user');
    }
  }, [userProfile, unfollowUser, followUser, fetchUserProfile, id]);

  const renderMurmur = useCallback(({ item }: { item: Murmur }) => (
    <MurmurItem
      murmur={item}
      onLike={handleLike}
      onDelete={handleDelete}
      onMurmurPress={handleMurmurPress}
      onUserPress={() => {}} // Don't navigate to same profile
    />
  ), [handleLike, handleDelete, handleMurmurPress]);

  const renderHeader = useCallback(() => {
    if (!userProfile?.user) return null;

    const isOwnProfile = user?.id === userProfile.user.id;

    return (
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userProfile.user.displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>
        
        <View style={styles.userInfo}>
          <Text style={styles.displayName}>{userProfile.user.displayName}</Text>
          <Text style={styles.username}>@{userProfile.user.username}</Text>
          {userProfile.user.bio && (
            <Text style={styles.bio}>{userProfile.user.bio}</Text>
          )}
        </View>

        {!isOwnProfile && (
          <TouchableOpacity
            style={[
              styles.followButton,
              userProfile.user.isFollowing && styles.followingButton
            ]}
            onPress={handleFollow}
            disabled={userProfile.isLoading}
          >
            {userProfile.isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={[
                styles.followButtonText,
                userProfile.user.isFollowing && styles.followingButtonText
              ]}>
                {userProfile.user.isFollowing ? 'Following' : 'Follow'}
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  }, [userProfile, user, handleFollow]);

  const renderFooter = useCallback(() => {
    if (userMurmurs.isLoading) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color="#1DA1F2" />
        </View>
      );
    }
    return null;
  }, [userMurmurs.isLoading]);

  const renderEmptyState = useCallback(() => {
    if (!userMurmurs.isLoading && userMurmurs.murmurs.length === 0) {
      return (
        <EmptyState
          title="No Murmurs"
          subtitle="This user hasn't posted any murmurs yet"
        />
      );
    }
    return null;
  }, [userMurmurs.isLoading, userMurmurs.murmurs.length]);

  if (userProfile?.isLoading && !userProfile.user) {
    return <LoadingSpinner />;
  }

  if (!userProfile?.user) {
    return (
      <View style={styles.container}>
        <EmptyState
          title="User Not Found"
          subtitle="This user doesn't exist or has been deleted"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={userMurmurs.murmurs}
        renderItem={renderMurmur}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#1DA1F2"
            colors={['#1DA1F2']}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={userMurmurs.murmurs.length === 0 ? styles.emptyContainer : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  emptyContainer: {
    flexGrow: 1,
  },
  profileHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1DA1F2',
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 20,
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
  followButton: {
    backgroundColor: '#1DA1F2',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followingButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#1DA1F2',
  },
  followButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  followingButtonText: {
    color: '#1DA1F2',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
