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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Components
import MurmurItem from '../../components/murmur/MurmurItem';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

// Hooks
import { useAuth, useMurmurs, useUsers } from '../../store/hooks';

// Types
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Murmur, User } from '../../types';

type UserProfileRouteProp = RouteProp<RootStackParamList, 'UserProfile'>;
type UserProfileNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const UserProfileScreen = () => {
  const [activeTab, setActiveTab] = useState<'murmurs' | 'likes'>('murmurs');
  
  const navigation = useNavigation<UserProfileNavigationProp>();
  const route = useRoute<UserProfileRouteProp>();
  const { userId } = route.params;
  
  const { user: currentUser } = useAuth();
  const { userProfile, fetchUserProfile, followUser, unfollowUser } = useUsers();
  const { userMurmurs: allUserMurmurs, fetchUserMurmurs, likeMurmur } = useMurmurs();
  
  // Get the specific user profile for this userId
  const currentUserProfile = userProfile[userId]?.user;
  const isLoadingProfile = userProfile[userId]?.isLoading || false;
  const userMurmurs = allUserMurmurs[userId] || { murmurs: [], isLoading: false, hasMore: false, pagination: null, error: null };

  useEffect(() => {
    fetchUserProfile(userId);
    fetchUserMurmurs({ userId, page: 1, limit: 10, refresh: true });
  }, [userId]);

  const handleRefresh = useCallback(() => {
    fetchUserProfile(userId);
    fetchUserMurmurs({ userId, page: 1, limit: 10, refresh: true });
  }, [userId]);

  const handleFollow = useCallback(async () => {
    if (!currentUserProfile) return;
    
    try {
      if (currentUserProfile.isFollowing) {
        await unfollowUser(userId);
      } else {
        await followUser(userId);
      }
      fetchUserProfile(userId);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update follow status');
    }
  }, [currentUserProfile, userId, followUser, unfollowUser, fetchUserProfile]);

  const handleLike = useCallback(async (murmurId: string) => {
    try {
      await likeMurmur(murmurId);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to like murmur');
    }
  }, [likeMurmur]);

  const handleMurmurPress = useCallback((murmur: Murmur) => {
    navigation.navigate('MurmurDetail', { murmurId: murmur.id });
  }, [navigation]);

  const handleUserPress = useCallback((userId: string) => {
    if (userId !== currentUserProfile?.id) {
      navigation.navigate('UserProfile', { userId });
    }
  }, [navigation, currentUserProfile?.id]);

  const renderMurmur = useCallback(({ item }: { item: Murmur }) => (
    <MurmurItem
      murmur={item}
      onLike={handleLike}
      onDelete={() => {}} // Can't delete other users' murmurs
      onMurmurPress={handleMurmurPress}
      onUserPress={handleUserPress}
    />
  ), [handleLike, handleMurmurPress, handleUserPress]);

  const renderEmptyState = useCallback(() => {
    if (activeTab === 'murmurs') {
      return (
        <EmptyState
          title="No Murmurs"
          subtitle="This user hasn't posted any murmurs yet"
          icon="📭"
        />
      );
    } else {
      return (
        <EmptyState
          title="No Liked Murmurs"
          subtitle="This user hasn't liked any murmurs yet"
          icon="❤️"
        />
      );
    }
  }, [activeTab]);

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

  if (isLoadingProfile || !currentUserProfile) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  const isOwnProfile = currentUser?.id === currentUserProfile.id;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={false}
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
              {currentUserProfile.displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
          
          <View style={styles.userInfo}>
            <Text style={styles.displayName}>{currentUserProfile.displayName}</Text>
            <Text style={styles.username}>@{currentUserProfile.username}</Text>
            {currentUserProfile.bio && <Text style={styles.bio}>{currentUserProfile.bio}</Text>}
          </View>

          {!isOwnProfile && (
            <TouchableOpacity
              style={[
                styles.followButton,
                currentUserProfile.isFollowing ? styles.followingButton : styles.followButtonActive
              ]}
              onPress={handleFollow}
              disabled={currentUserProfile.isFollowing === undefined}
            >
              <Text style={[
                styles.followButtonText,
                currentUserProfile.isFollowing ? styles.followingButtonText : styles.followButtonTextActive
              ]}>
                {currentUserProfile.isFollowing ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{currentUserProfile.murmursCount}</Text>
            <Text style={styles.statLabel}>Murmurs</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{currentUserProfile.followingCount}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{currentUserProfile.followersCount}</Text>
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
          userMurmurs.murmurs.length > 0 ? (
            userMurmurs.murmurs.map((murmur: Murmur) => (
              <MurmurItem
                key={murmur.id}
                murmur={murmur}
                onLike={handleLike}
                onDelete={() => {}} // Can't delete other users' murmurs
                onMurmurPress={handleMurmurPress}
                onUserPress={handleUserPress}
              />
            ))
          ) : (
            renderEmptyState()
          )
        ) : (
          renderEmptyState()
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
  followButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 120,
    alignItems: 'center',
    alignSelf: 'center',
  },
  followButtonActive: {
    backgroundColor: '#1DA1F2',
  },
  followingButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#1DA1F2',
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  followButtonTextActive: {
    color: '#ffffff',
  },
  followingButtonText: {
    color: '#1DA1F2',
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

export default UserProfileScreen;
