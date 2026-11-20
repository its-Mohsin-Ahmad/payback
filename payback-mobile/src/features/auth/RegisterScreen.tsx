import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../theme/colors';
import { PaybackLogo } from '../../components/brand/PaybackLogo';
import { User, Mail, Lock, Eye, EyeOff, CheckSquare, Square, ArrowLeft } from 'lucide-react-native';

interface RegisterScreenProps {
  onRegisterSuccess: () => void;
  onNavigateToLogin: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onRegisterSuccess,
  onNavigateToLogin,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Password strength calculator
  const getPasswordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  };

  const strength = getPasswordStrength();

  const handleRegister = () => {
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full legal name.');
      return;
    }
    if (!email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (!agreed) {
      setErrorMsg('Please accept the Terms & Privacy Policy.');
      return;
    }

    setErrorMsg('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onRegisterSuccess();
    }, 900);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Top Bar with Back Button */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onNavigateToLogin} style={styles.backBtn}>
          <ArrowLeft size={22} color={Colors.primaryNavy} />
        </TouchableOpacity>
        <PaybackLogo size={28} showText={false} />
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Open your digital PAYBACK account in minutes</Text>
        </View>

        {errorMsg ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          {/* Full Name */}
          <View style={styles.inputWrapper}>
            <User size={20} color={Colors.secondaryText} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Full Legal Name"
              placeholderTextColor="#94A3B8"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          {/* Email */}
          <View style={styles.inputWrapper}>
            <Mail size={20} color={Colors.secondaryText} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Email Address"
              placeholderTextColor="#94A3B8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password */}
          <View style={styles.inputWrapper}>
            <Lock size={20} color={Colors.secondaryText} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Password (min 8 chars)"
              placeholderTextColor="#94A3B8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOff size={20} color={Colors.secondaryText} />
              ) : (
                <Eye size={20} color={Colors.secondaryText} />
              )}
            </TouchableOpacity>
          </View>

          {/* Password Strength Indicator */}
          {password.length > 0 && (
            <View style={styles.strengthContainer}>
              <View style={styles.strengthBars}>
                <View
                  style={[
                    styles.strengthSegment,
                    strength >= 1 && { backgroundColor: strength === 1 ? '#EF4444' : '#F59E0B' },
                  ]}
                />
                <View
                  style={[
                    styles.strengthSegment,
                    strength >= 2 && { backgroundColor: strength === 2 ? '#F59E0B' : '#10B981' },
                  ]}
                />
                <View
                  style={[
                    styles.strengthSegment,
                    strength >= 3 && { backgroundColor: '#10B981' },
                  ]}
                />
                <View
                  style={[
                    styles.strengthSegment,
                    strength >= 4 && { backgroundColor: '#16A875' },
                  ]}
                />
              </View>
              <Text style={styles.strengthLabel}>
                {strength <= 1 ? 'Weak' : strength <= 3 ? 'Medium' : 'Strong Security'}
              </Text>
            </View>
          )}

          {/* Confirm Password */}
          <View style={styles.inputWrapper}>
            <Lock size={20} color={Colors.secondaryText} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Confirm Password"
              placeholderTextColor="#94A3B8"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
          </View>

          {/* Terms Agreement Checkbox */}
          <TouchableOpacity
            style={styles.termsRow}
            onPress={() => setAgreed(!agreed)}
            activeOpacity={0.8}
          >
            {agreed ? (
              <CheckSquare size={20} color={Colors.electricBlue} />
            ) : (
              <Square size={20} color={Colors.secondaryText} />
            )}
            <Text style={styles.termsText}>
              I agree to the <Text style={styles.termsHighlight}>Terms of Service</Text> and{' '}
              <Text style={styles.termsHighlight}>Privacy Policy</Text>.
            </Text>
          </TouchableOpacity>

          {/* Submit Button */}
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={handleRegister}
            disabled={loading}
            style={[styles.registerBtn, Colors.shadows.button]}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.registerBtnText}>Create Account</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={onNavigateToLogin}>
            <Text style={styles.signInLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 36,
  },
  header: {
    marginTop: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.primaryNavy,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginTop: 4,
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: Colors.errorRed,
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '500',
  },
  form: {
    gap: 14,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    height: 54,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.primaryNavy,
    fontWeight: '500',
  },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: -4,
  },
  strengthBars: {
    flexDirection: 'row',
    gap: 6,
    flex: 1,
  },
  strengthSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
  },
  strengthLabel: {
    fontSize: 11,
    color: Colors.secondaryText,
    fontWeight: '600',
    marginLeft: 12,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    color: Colors.secondaryText,
    lineHeight: 18,
  },
  termsHighlight: {
    color: Colors.electricBlue,
    fontWeight: '600',
  },
  registerBtn: {
    backgroundColor: Colors.electricBlue,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  registerBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: Colors.secondaryText,
    fontSize: 14,
  },
  signInLink: {
    color: Colors.electricBlue,
    fontSize: 14,
    fontWeight: '700',
  },
});
