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
  identifier?: string;
  password?: string;
}

const LoginScreen = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isFormValid, setIsFormValid] = useState(false);
  
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuth();
  console.log(error,"error login")

  // Validate individual fields
  const validateField = (field: string, value: string): string | undefined => {
    switch (field) {
      case 'identifier':
        if (!value.trim()) {
          return 'Email or username is required';
        }
        if (value.trim().length < 3) {
          return 'Must be at least 3 characters long';
        }
        break;
      case 'password':
        if (!value.trim()) {
          return 'Password is required';
        }
        if (value.length < 1) {
          return 'Password cannot be empty';
        }
        break;
    }
    return undefined;
  };

  // Validate entire form
  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    const identifierError = validateField('identifier', identifier);
    if (identifierError) errors.identifier = identifierError;
    
    const passwordError = validateField('password', password);
    if (passwordError) errors.password = passwordError;
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Update form validity when fields change
  useEffect(() => {
    const isValid = identifier.trim().length >= 3 && password.trim().length > 0;
    setIsFormValid(isValid);
    
    // Clear specific field error when user starts typing
    if (identifier.trim().length >= 3 && formErrors.identifier) {
      setFormErrors(prev => ({ ...prev, identifier: undefined }));
    }
    if (password.trim().length > 0 && formErrors.password) {
      setFormErrors(prev => ({ ...prev, password: undefined }));
    }
    
    if ((identifier || password) && error) {
      clearError();
    }
  }, [identifier, password, error, clearError]);

  const handleLogin = async () => {
    // Clear previous errors
    setFormErrors({});
    
    if (!validateForm()) {
      return;
    }

    try {
      await login({ identifier: identifier.trim(), password });
      
      // Login successful - navigate to main app
      // Navigation will be handled by the AuthChecker component based on auth state
    } catch (err: any) {
      Alert.alert('Login Failed', err.message || 'An error occurred during login');
    }
  };

  const navigateToRegister = () => {
    router.push('/(auth)/register');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <Text style={styles.title}>Welcome to Murmur</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email or Username</Text>
              <TextInput
                style={[
                  styles.input,
                  formErrors.identifier ? styles.inputError : null
                ]}
                value={identifier}
                onChangeText={setIdentifier}
                placeholder="Enter your email or username"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
              {formErrors.identifier && (
                <Text style={styles.fieldErrorText}>{formErrors.identifier}</Text>
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
                  placeholder="Enter your password"
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

            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}

            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.disabledButton]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.forgotPasswordButton}
              onPress={() => {
                // TODO: Implement forgot password
                Alert.alert('Info', 'Forgot password functionality will be implemented soon');
              }}
              disabled={isLoading}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={navigateToRegister} disabled={isLoading}>
              <Text style={styles.signUpText}>Sign Up</Text>
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
    marginBottom: 48,
  },
  form: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
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
  loginButton: {
    backgroundColor: '#1DA1F2',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: '#AAB8C2',
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPasswordButton: {
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#1DA1F2',
    fontSize: 14,
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
  signUpText: {
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

export default LoginScreen;
