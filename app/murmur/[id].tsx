import React, { useEffect, useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Components
import MurmurItem from '../../src/components/murmur/MurmurItem';
import LoadingSpinner from '../../src/components/common/LoadingSpinner';

// Hooks
import { useMurmurs, useAuth } from '../../src/store/hooks';

// Types
import { Murmur } from '../../src/types';

export default function MurmurDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [replyContent, setReplyContent] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  
  const { currentMurmur, replies, fetchMurmur, fetchReplies, createMurmur, likeMurmur, deleteMurmur } = useMurmurs();
  const { user } = useAuth();
  const murmur = currentMurmur?.murmur;
  const repliesData = id ? replies[id] : null;

  useEffect(() => {
    if (id) {
      fetchMurmur(id);
      fetchReplies({ murmurId: id, refresh: true });
    }
  }, [id]);

  const handleLike = useCallback(async () => {
    if (!murmur) return;
    
    try {
      await likeMurmur(murmur.id);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to like murmur');
    }
  }, [murmur, likeMurmur]);

  const handleDelete = useCallback(() => {
    if (!murmur) return;
    
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
              await deleteMurmur(murmur.id);
              router.back();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete murmur');
            }
          },
        },
      ]
    );
  }, [murmur, deleteMurmur, router]);

  const handleUserPress = useCallback((userId: string) => {
    router.push(`/user/${userId}` as any);
  }, [router]);

  const handleDeleteReply = useCallback(async (replyId: string) => {
    try {
      await deleteMurmur(replyId);
      // Refresh replies after deletion
      if (id) {
        fetchReplies({ murmurId: id, refresh: true });
        fetchMurmur(id); // Refresh to update reply count
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to delete reply');
    }
  }, [deleteMurmur, fetchReplies, fetchMurmur, id]);

  const handleReply = useCallback(async () => {
    if (!replyContent.trim() || !murmur) {
      Alert.alert('Error', 'Please enter a reply');
      return;
    }

    setIsReplying(true);
    
    try {
      await createMurmur({ content: replyContent.trim(), replyToId: murmur.id });
      setReplyContent('');
      
      // Refresh replies and murmur to update reply count
      if (id) {
        fetchReplies({ murmurId: id, refresh: true });
        fetchMurmur(id);
      }
      
      Alert.alert('Success', 'Reply posted successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to post reply');
    } finally {
      setIsReplying(false);
    }
  }, [replyContent, murmur, createMurmur, id, fetchReplies, fetchMurmur]);

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

  if (!murmur) {
    return <LoadingSpinner message="Loading murmur..." />;
  }

  const isOwnMurmur = user?.id === murmur.userId;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
      {/* Back Button Header */}
      <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Murmur</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Murmur Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => handleUserPress(murmur.userId)}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {murmur.user.displayName.charAt(0).toUpperCase()}
              </Text>
            </View>
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => handleUserPress(murmur.userId)}>
              <Text style={styles.displayName}>{murmur.user.displayName}</Text>
              <Text style={styles.username}>@{murmur.user.username}</Text>
            </TouchableOpacity>
            <Text style={styles.timestamp}>{formatDate(murmur.createdAt)}</Text>
          </View>

          {isOwnMurmur && (
            <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>🗑️</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Murmur Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.content}>{murmur.content}</Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
            <Text style={[styles.actionText, murmur.isLikedByUser && styles.liked]}>
              {murmur.isLikedByUser ? '❤️' : '🤍'}
            </Text>
            <Text style={[styles.actionCount, murmur.isLikedByUser && styles.liked]}>
              {murmur.likesCount}
            </Text>
          </TouchableOpacity>

          <View style={styles.actionButton}>
            <Text style={styles.actionText}>💬</Text>
            <Text style={styles.actionCount}>{murmur.repliesCount}</Text>
          </View>
        </View>

        {/* Replies Section */}
        <View style={styles.repliesSection}>
          <Text style={styles.repliesTitle}>Replies ({murmur.repliesCount})</Text>
          {repliesData?.isLoading && repliesData.replies.length === 0 ? (
            <ActivityIndicator size="small" color="#1DA1F2" style={styles.repliesLoader} />
          ) : repliesData?.replies && repliesData.replies.length > 0 ? (
            repliesData.replies.map((reply) => (
              <MurmurItem
                key={reply.id}
                murmur={reply}
                onPress={() => router.push(`/murmur/${reply.id}` as any)}
                onUserPress={handleUserPress}
                onLike={(id) => likeMurmur(id)}
                onDelete={handleDeleteReply}
                showReplyButton={false}
              />
            ))
          ) : (
            <Text style={styles.noRepliesText}>No replies yet. Be the first to reply!</Text>
          )}
        </View>
      </ScrollView>

      {/* Reply Input */}
      <View style={styles.replyContainer}>
        <TextInput
          style={styles.replyInput}
          value={replyContent}
          onChangeText={setReplyContent}
          placeholder="Write a reply..."
          placeholderTextColor="#657786"
          multiline
          maxLength={280}
          editable={!isReplying}
        />
        <TouchableOpacity
          style={[
            styles.replyButton,
            (!replyContent.trim() || isReplying) && styles.disabledReplyButton
          ]}
          onPress={handleReply}
          disabled={!replyContent.trim() || isReplying}
        >
          {isReplying ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.replyButtonText}>Reply</Text>
          )}
        </TouchableOpacity>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
    backgroundColor: '#ffffff',
  },
  backButton: {
    padding: 4,
  },
  backButtonText: {
    fontSize: 16,
    color: '#1DA1F2',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#14171A',
    marginLeft: 16,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1DA1F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerContent: {
    flex: 1,
  },
  displayName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#14171A',
    marginBottom: 2,
  },
  username: {
    fontSize: 14,
    color: '#657786',
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    color: '#657786',
  },
  deleteButton: {
    padding: 4,
  },
  deleteButtonText: {
    fontSize: 16,
  },
  contentContainer: {
    padding: 16,
  },
  content: {
    fontSize: 18,
    lineHeight: 26,
    color: '#14171A',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  actionText: {
    fontSize: 16,
    marginRight: 4,
  },
  actionCount: {
    fontSize: 14,
    color: '#657786',
  },
  liked: {
    color: '#E0245E',
  },
  repliesSection: {
    padding: 16,
  },
  repliesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#14171A',
    marginBottom: 16,
  },
  noRepliesText: {
    fontSize: 14,
    color: '#657786',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  repliesPlaceholder: {
    fontSize: 14,
    color: '#657786',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  repliesLoader: {
    marginVertical: 20,
  },
  replyContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E1E8ED',
    backgroundColor: '#ffffff',
  },
  replyInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E1E8ED',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 16,
  },
  replyButton: {
    backgroundColor: '#1DA1F2',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledReplyButton: {
    backgroundColor: '#AAB8C2',
  },
  replyButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
