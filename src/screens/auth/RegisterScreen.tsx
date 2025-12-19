import React, { useState, useEffect } from 'react';
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
import { useRouter } from 'expo-router';

// Hooks
import { useAuth } from '../../store/hooks';

interface FormErrors {
  name?: string;
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
}

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isFormValid, setIsFormValid] = useState(false);
  
  const router = useRouter();
  const { register, isLoading, error } = useAuth();

  // Validate individual fields
  const validateField = (field: string, value: string, compareValue?: string): string | undefined => {
    switch (field) {
      case 'name':
        if (!value.trim()) {
          return 'Display name is required';
        }
        if (value.trim().length < 1) {
          return 'Display name cannot be empty';
        }
        if (value.trim().length > 50) {
          return 'Display name must be less than 50 characters';
        }
        break;
      case 'email':
        if (!value.trim()) {
          return 'Email is required';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return 'Please enter a valid email address';
        }
        break;
      case 'username':
        if (!value.trim()) {
          return 'Username is required';
        }
        if (value.length < 3) {
          return 'Username must be at least 3 characters long';
        }
        if (value.length > 30) {
          return 'Username must be less than 30 characters long';
        }
        if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          return 'Username can only contain letters, numbers, and underscores';
        }
        break;
      case 'password':
        if (!value.trim()) {
          return 'Password is required';
        }
        if (value.length < 8) {
          return 'Password must be at least 8 characters long';
        }
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          return 'Password must contain at least one lowercase letter, one uppercase letter, and one number';
        }
        break;
      case 'confirmPassword':
        if (!value.trim()) {
          return 'Please confirm your password';
        }
        if (value !== compareValue) {
          return 'Passwords do not match';
        }
        break;
    }
    return undefined;
  };

  // Validate entire form
  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    const nameError = validateField('name', name);
    if (nameError) errors.name = nameError;
    
    const emailError = validateField('email', email);
    if (emailError) errors.email = emailError;
    
    const usernameError = validateField('username', username);
    if (usernameError) errors.username = usernameError;
    
    const passwordError = validateField('password', password);
    if (passwordError) errors.password = passwordError;
    
    const confirmPasswordError = validateField('confirmPassword', confirmPassword, password);
    if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Update form validity when fields change
  useEffect(() => {
    const isValid = 
      name.trim().length > 0 &&
      email.trim().length > 0 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
      username.trim().length >= 3 &&
      username.length <= 30 &&
      /^[a-zA-Z0-9_]+$/.test(username) &&
      password.length >= 8 &&
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password) &&
      confirmPassword === password;
    
    setIsFormValid(isValid);
    
    // Clear specific field errors when user starts typing
    if (name.trim().length > 0 && formErrors.name) {
      setFormErrors(prev => ({ ...prev, name: undefined }));
    }
    if (email.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && formErrors.email) {
      setFormErrors(prev => ({ ...prev, email: undefined }));
    }
    if (username.trim().length >= 3 && username.length <= 30 && /^[a-zA-Z0-9_]+$/.test(username) && formErrors.username) {
      setFormErrors(prev => ({ ...prev, username: undefined }));
    }
    if (password.length >= 8 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password) && formErrors.password) {
      setFormErrors(prev => ({ ...prev, password: undefined }));
    }
    if (confirmPassword === password && confirmPassword.length > 0 && formErrors.confirmPassword) {
      setFormErrors(prev => ({ ...prev, confirmPassword: undefined }));
    }
  }, [name, email, username, password, confirmPassword]);

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const result = await register({
        displayName: name.trim(),
        email: email.trim(),
        username: username.trim().toLowerCase(),
        password,
      });
      
      // Registration successful - navigate to main app
      if (result) {
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      // Error is already handled by the Redux state, but show alert for immediate feedback
      Alert.alert('Registration Failed', err.message || 'An error occurred during registration');
    }
  };

  const navigateToLogin = () => {
    router.push('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <Text style={styles.title}>Join Murmur</Text>
          <Text style={styles.subtitle}>Create your account to get started</Text>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={[
                  styles.input,
                  formErrors.name ? styles.inputError : null
                ]}
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
                autoCapitalize="words"
                editable={!isLoading}
              />
              {formErrors.name && (
                <Text style={styles.fieldErrorText}>{formErrors.name}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={[
                  styles.input,
                  formErrors.username ? styles.inputError : null
                ]}
                value={username}
                onChangeText={setUsername}
                placeholder="Choose a username"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
              {formErrors.username && (
                <Text style={styles.fieldErrorText}>{formErrors.username}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[
                  styles.input,
                  formErrors.email ? styles.inputError : null
                ]}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
              {formErrors.email && (
                <Text style={styles.fieldErrorText}>{formErrors.email}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.input, 
                    styles.passwordInput,
                    formErrors.password ? styles.inputError : null
                  ]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Create a password"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  editable={!isLoading}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  <Text style={styles.eyeIconText}>
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </Text>
                </TouchableOpacity>
              </View>
              {formErrors.password && (
                <Text style={styles.fieldErrorText}>{formErrors.password}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.input, 
                    styles.passwordInput,
                    formErrors.confirmPassword ? styles.inputError : null
                  ]}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm your password"
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  editable={!isLoading}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  <Text style={styles.eyeIconText}>
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </Text>
                </TouchableOpacity>
              </View>
              {formErrors.confirmPassword && (
                <Text style={styles.fieldErrorText}>{formErrors.confirmPassword}</Text>
              )}
            </View>

            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}

            <TouchableOpacity
              style={[styles.registerButton, isLoading && styles.disabledButton]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <Text style={styles.registerButtonText}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={navigateToLogin} disabled={isLoading}>
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          </View>
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
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1DA1F2',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#657786',
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#14171A',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E1E8ED',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#F7F9FA',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    padding: 4,
  },
  eyeIconText: {
    fontSize: 20,
  },
  errorText: {
    color: '#E0245E',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  registerButton: {
    backgroundColor: '#1DA1F2',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledButton: {
    backgroundColor: '#AAB8C2',
  },
  registerButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#657786',
    fontSize: 14,
  },
  signInText: {
    color: '#1DA1F2',
    fontSize: 14,
    fontWeight: '600',
  },
  inputError: {
    borderColor: '#E0245E',
    backgroundColor: '#FFF5F7',
  },
  fieldErrorText: {
    color: '#E0245E',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default RegisterScreen;
