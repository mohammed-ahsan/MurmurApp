import React, { useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// Components
import MurmurItem from '../../components/murmur/MurmurItem';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

// Hooks
import { useMurmurs, useUI } from '../../store/hooks';

// Types
import { Murmur } from '../../types';

const TimelineScreen = () => {
  const router = useRouter();
  const { timeline, fetchTimeline, likeMurmur, deleteMurmur } = useMurmurs();
  const { showCreateMurmurModal, showDeleteMurmurModal } = useUI();
  
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Initial fetch
    fetchTimeline({ page: 1, limit: 10, refresh: true });
  }, []);

  const handleRefresh = useCallback(() => {
    fetchTimeline({ page: 1, limit: 10, refresh: true });
  }, [fetchTimeline]);

  const handleLoadMore = useCallback(() => {
    if (!timeline.isLoading && timeline.hasMore && timeline.pagination) {
      fetchTimeline({
        page: timeline.pagination.page + 1,
        limit: 10,
        refresh: false,
      });
    }
  }, [fetchTimeline, timeline.isLoading, timeline.hasMore, timeline.pagination]);

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
    router.push(`/user/${userId}` as any);
  }, [router]);

  const handleCreateMurmur = useCallback(() => {
    router.push('/modal');
  }, [router]);

  const renderMurmur = useCallback(({ item }: { item: Murmur }) => (
    <MurmurItem
      murmur={item}
      onLike={handleLike}
      onDelete={handleDelete}
      onMurmurPress={handleMurmurPress}
      onUserPress={handleUserPress}
    />
  ), [handleLike, handleDelete, handleMurmurPress, handleUserPress]);

  const renderFooter = useCallback(() => {
    if (timeline.isLoading) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color="#1DA1F2" />
        </View>
      );
    }
    return null;
  }, [timeline.isLoading]);

  const renderEmptyState = useCallback(() => {
    if (!timeline.isLoading && timeline.murmurs.length === 0) {
      return (
        <EmptyState
          title="Your Timeline is Empty"
          subtitle="Explore and follow users to see their murmurs here"
          actionText="Explore Now"
          onAction={() => router.push('/(tabs)/search' as any)}
          icon="🌍"
        />
      );
    }
    return null;
  }, [timeline.isLoading, timeline.murmurs.length, router]);

  if (timeline.isLoading && timeline.murmurs.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={timeline.murmurs}
        renderItem={renderMurmur}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={timeline.isLoading}
            onRefresh={handleRefresh}
            tintColor="#1DA1F2"
            colors={['#1DA1F2']}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={timeline.murmurs.length === 0 ? styles.emptyContainer : null}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleCreateMurmur}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  emptyContainer: {
    flexGrow: 1,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1DA1F2',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 28,
  },
});

export default TimelineScreen;
