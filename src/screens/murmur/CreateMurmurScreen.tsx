import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Hooks
import { useMurmurs } from '../../store/hooks';

const CreateMurmurScreen = () => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();
  const params = useLocalSearchParams<{ replyToMurmurId?: string }>();
  const replyToMurmurId = params.replyToMurmurId;
  
  const { createMurmur } = useMurmurs();

  const handleSubmit = useCallback(async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Please enter some content for your murmur');
      return;
    }

    if (content.length > 280) {
      Alert.alert('Error', 'Murmur cannot exceed 280 characters');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await createMurmur(content.trim());
      
      setContent('');
      router.back();
      
      Alert.alert(
        'Success',
        replyToMurmurId ? 'Reply posted successfully!' : 'Murmur posted successfully!'
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to post murmur');
    } finally {
      setIsSubmitting(false);
    }
  }, [content, replyToMurmurId, createMurmur, router]);

  const handleCancel = useCallback(() => {
    if (content.trim()) {
      Alert.alert(
        'Discard Murmur',
        'Are you sure you want to discard this murmur?',
        [
          {
            text: 'Keep',
            style: 'cancel',
          },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      router.back();
    }
  }, [content, router]);

  const characterCount = content.length;
  const isOverLimit = characterCount > 280;
  const canSubmit = content.trim().length > 0 && !isOverLimit && !isSubmitting;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancel}
          disabled={isSubmitting}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <Text style={styles.title}>
          {replyToMurmurId ? 'Reply' : 'New Murmur'}
        </Text>
        
        <TouchableOpacity
          style={[
            styles.postButton,
            canSubmit ? styles.activePostButton : styles.disabledPostButton
          ]}
          onPress={handleSubmit}
          disabled={!canSubmit}
        >
          {isSubmitting ? (
            <Text style={styles.postButtonText}>Posting...</Text>
          ) : (
            <Text style={styles.postButtonText}>Post</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.contentContainer}>
        <TextInput
          style={styles.textInput}
          value={content}
          onChangeText={setContent}
          placeholder={replyToMurmurId ? "What's your reply?" : "What's happening?"}
          placeholderTextColor="#657786"
          multiline
          autoFocus
          maxLength={280}
          editable={!isSubmitting}
          textAlignVertical="top"
        />
        
        <View style={styles.footer}>
          <Text style={[
            styles.characterCount,
            isOverLimit && styles.overLimit
          ]}>
            {characterCount}/280
          </Text>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#1DA1F2',
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#14171A',
  },
  postButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  activePostButton: {
    backgroundColor: '#1DA1F2',
  },
  disabledPostButton: {
    backgroundColor: '#AAB8C2',
  },
  postButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    lineHeight: 24,
    color: '#14171A',
    minHeight: 120,
    maxHeight: 300,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E1E8ED',
    marginTop: 16,
  },
  characterCount: {
    fontSize: 14,
    color: '#657786',
  },
  overLimit: {
    color: '#E0245E',
  },
});

export default CreateMurmurScreen;
