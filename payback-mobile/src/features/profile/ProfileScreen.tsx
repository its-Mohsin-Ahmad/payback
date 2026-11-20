import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { useAuthStore } from '../../store/useAuthStore';
import {
  User,
  Shield,
  Bell,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
  Edit3,
} from 'lucide-react-native';

interface ProfileScreenProps {
  onLogout: () => void;
  onNavigateToNotifications: () => void;
  onNavigateToSupport: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onLogout,
  onNavigateToNotifications,
  onNavigateToSupport,
}) => {
  const { user } = useAuthStore();

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing is enabled for verified members.');
  };

  const handleSecuritySettings = () => {
    Alert.alert(
      'Security Settings',
      'Biometric authentication, two-factor authentication (2FA), and device management are active.'
    );
  };

  const handleAboutPayback = () => {
    Alert.alert(
      'About PAYBACK',
      'PAYBACK v1.0.0\nBanking Built Around You.\n\nA premium digital fintech ecosystem engineered for secure personal and corporate financial freedom.'
    );
  };

  const menuItems = [
    {
      icon: User,
      label: 'Edit Profile',
      onPress: handleEditProfile,
      color: Colors.electricBlue,
    },
    {
      icon: Shield,
      label: 'Security Settings',
      onPress: handleSecuritySettings,
      color: '#10B981',
    },
    {
      icon: Bell,
      label: 'Notification Preferences',
      onPress: onNavigateToNotifications,
      color: '#F59E0B',
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      onPress: onNavigateToSupport,
      color: '#8B5CF6',
    },
    {
      icon: Info,
      label: 'About PAYBACK',
      onPress: handleAboutPayback,
      color: Colors.secondaryNavy,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile & Settings</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* User Card (matching reference image) */}
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
              }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editBadge} onPress={handleEditProfile} activeOpacity={0.8}>
              <Edit3 size={12} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{user?.fullName || 'Mohsin Ahmad'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'mohsin@email.com'}</Text>

          <View style={styles.tierBadge}>
            <Text style={styles.tierText}>{user?.accountTier || 'Premium Elite'}</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => {
            const IconComp = item.icon;
            return (
              <TouchableOpacity
                key={index}
                style={styles.menuRow}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View style={[styles.menuIconBox, { backgroundColor: item.color + '15' }]}>
                  <IconComp size={20} color={item.color} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <ChevronRight size={18} color={Colors.secondaryText} />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => {
            Alert.alert('Logout', 'Are you sure you want to sign out?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Logout', style: 'destructive', onPress: onLogout },
            ]);
          }}
          activeOpacity={0.8}
        >
          <LogOut size={18} color={Colors.errorRed} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.versionFooter}>PAYBACK Android v1.0.0 (Build 1)</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FC',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primaryNavy,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 3,
    borderColor: Colors.electricBlue,
  },
  editBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.electricBlue,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 19,
    fontWeight: '800',
    color: Colors.primaryNavy,
  },
  userEmail: {
    fontSize: 13,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  tierBadge: {
    backgroundColor: 'rgba(8, 120, 249, 0.08)',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 14,
    marginTop: 10,
  },
  tierText: {
    color: Colors.electricBlue,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primaryNavy,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: Colors.errorRed,
    borderRadius: 24,
    paddingVertical: 13,
    backgroundColor: '#FFFFFF',
  },
  logoutText: {
    color: Colors.errorRed,
    fontSize: 15,
    fontWeight: '700',
  },
  versionFooter: {
    textAlign: 'center',
    fontSize: 11,
    color: Colors.secondaryText,
    marginTop: 20,
  },
});
