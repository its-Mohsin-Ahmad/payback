import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Colors } from '../../theme/colors';
import { Home, CreditCard, ArrowLeftRight, User } from 'lucide-react-native';

export type TabScreenType = 'home' | 'cards' | 'transactions' | 'profile';

interface BottomTabBarProps {
  currentTab: TabScreenType;
  onSelectTab: (tab: TabScreenType) => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ currentTab, onSelectTab }) => {
  const tabs = [
    { id: 'home' as TabScreenType, label: 'Home', icon: Home },
    { id: 'cards' as TabScreenType, label: 'Cards', icon: CreditCard },
    { id: 'transactions' as TabScreenType, label: 'Transactions', icon: ArrowLeftRight },
    { id: 'profile' as TabScreenType, label: 'Profile', icon: User },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          const IconComponent = tab.icon;
          return (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.8}
              onPress={() => onSelectTab(tab.id)}
              style={styles.tabButton}
            >
              <View style={[styles.iconBox, isActive && styles.activeIconBox]}>
                <IconComponent
                  size={22}
                  color={isActive ? Colors.electricBlue : Colors.secondaryText}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  { color: isActive ? Colors.electricBlue : Colors.secondaryText },
                  isActive && styles.activeTabLabel,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEF2F6',
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    paddingTop: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    flex: 1,
  },
  iconBox: {
    padding: 4,
    borderRadius: 12,
    marginBottom: 3,
  },
  activeIconBox: {
    backgroundColor: 'rgba(8, 120, 249, 0.08)',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  activeTabLabel: {
    fontWeight: '700',
  },
});
