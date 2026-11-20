import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { useBankStore } from '../../store/useBankStore';
import {
  ArrowLeft,
  Bell,
  ShieldAlert,
  CreditCard,
  Info,
  CheckCheck,
} from 'lucide-react-native';
import { NotificationItem } from '../../types';

interface NotificationsScreenProps {
  onGoBack: () => void;
}

type NotifFilter = 'all' | 'transactions' | 'security';

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ onGoBack }) => {
  const { notifications, markNotificationAsRead, clearAllNotifications } = useBankStore();
  const [filter, setFilter] = useState<NotifFilter>('all');

  const filtered = notifications.filter((n) => {
    if (filter === 'transactions') return n.type === 'transaction';
    if (filter === 'security') return n.type === 'security';
    return true;
  });

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'transaction':
        return <CreditCard size={18} color={Colors.electricBlue} />;
      case 'security':
        return <ShieldAlert size={18} color={Colors.errorRed} />;
      default:
        return <Info size={18} color="#8B5CF6" />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backBtn}>
          <ArrowLeft size={22} color={Colors.primaryNavy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={clearAllNotifications} style={styles.clearBtn}>
          <CheckCheck size={18} color={Colors.electricBlue} />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {(['all', 'transactions', 'security'] as NotifFilter[]).map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
          >
            <Text style={[styles.filterTabText, filter === f && styles.filterTabTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.notifCard, !item.isRead && styles.unreadCard]}
            onPress={() => markNotificationAsRead(item.id)}
            activeOpacity={0.8}
          >
            <View style={styles.iconCircle}>{getIcon(item.type)}</View>
            <View style={styles.notifBody}>
              <View style={styles.titleRow}>
                <Text style={styles.notifTitle}>{item.title}</Text>
                {!item.isRead && <View style={styles.unreadDot} />}
              </View>
              <Text style={styles.notifDesc}>{item.description}</Text>
              <Text style={styles.notifTime}>{item.timestamp}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Bell size={40} color={Colors.secondaryText} opacity={0.5} />
            <Text style={styles.emptyText}>No notifications here</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F0F9FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primaryNavy,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterTabActive: {
    backgroundColor: Colors.electricBlue,
    borderColor: Colors.electricBlue,
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.secondaryText,
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  notifCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  unreadCard: {
    borderLeftWidth: 3.5,
    borderLeftColor: Colors.electricBlue,
    backgroundColor: '#FAFCFF',
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notifBody: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryNavy,
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.electricBlue,
  },
  notifDesc: {
    fontSize: 13,
    color: Colors.secondaryText,
    marginTop: 4,
    lineHeight: 18,
  },
  notifTime: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 6,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.secondaryText,
    fontWeight: '500',
  },
});
