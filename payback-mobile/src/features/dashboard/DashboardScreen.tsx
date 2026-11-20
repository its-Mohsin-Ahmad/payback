import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../../theme/colors';
import { useBankStore } from '../../store/useBankStore';
import { useAuthStore } from '../../store/useAuthStore';
import {
  Bell,
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownLeft,
  FileText,
  Smartphone,
  LayoutGrid,
  ChevronRight,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface DashboardScreenProps {
  onNavigateToTransfers: () => void;
  onNavigateToBills: () => void;
  onNavigateToCards: () => void;
  onNavigateToTransactions: () => void;
  onNavigateToNotifications: () => void;
  onNavigateToProfile: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigateToTransfers,
  onNavigateToBills,
  onNavigateToCards,
  onNavigateToTransactions,
  onNavigateToNotifications,
  onNavigateToProfile,
}) => {
  const { account, transactions, toggleHideBalance, notifications } = useBankStore();
  const { user } = useAuthStore();

  const unreadNotifs = notifications.filter(n => !n.isRead).length;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 1. Header: Greeting & Profile */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greetingTitle}>Hello, Mohsin 👑</Text>
          <Text style={styles.greetingSub}>Welcome Back!</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.notifBtn}
            onPress={onNavigateToNotifications}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Bell size={22} color={Colors.primaryNavy} />
            {unreadNotifs > 0 && <View style={styles.notifBadge} />}
          </TouchableOpacity>

          <TouchableOpacity onPress={onNavigateToProfile} activeOpacity={0.8}>
            <View style={styles.avatarBorder}>
              <Image
                source={{ uri: user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' }}
                style={styles.avatar}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Main Balance Card (matches reference image gradient and wave pattern) */}
      <View style={[styles.balanceCardWrapper, Colors.shadows.card]}>
        <LinearGradient
          colors={['#0878F9', '#0A3272', '#061735']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.balanceCard}
        >
          {/* Wave Lines Vector */}
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <Svg width={width - 40} height={170} viewBox="0 0 340 170">
              <Path
                d="M-20,120 Q80,50 180,110 T380,80 L380,170 L-20,170 Z"
                fill="rgba(24, 184, 255, 0.12)"
              />
              <Path
                d="M-20,70 Q100,130 200,60 T380,100"
                fill="none"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="2"
              />
            </Svg>
          </View>

          {/* Top of Card: Balance Label & Hide/Show Eye */}
          <View style={styles.balanceTopRow}>
            <Text style={styles.balanceLabel}>Your Balance</Text>
            <TouchableOpacity onPress={toggleHideBalance} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              {account.isBalanceHidden ? (
                <EyeOff size={20} color="#FFFFFF" opacity={0.85} />
              ) : (
                <Eye size={20} color="#FFFFFF" opacity={0.85} />
              )}
            </TouchableOpacity>
          </View>

          {/* Balance Amount */}
          <View style={styles.balanceAmountRow}>
            <Text style={styles.currencyPrefix}>PKR </Text>
            <Text style={styles.balanceAmount}>
              {account.isBalanceHidden ? '••••••••' : account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Text>
          </View>

          {/* Account Sub-info */}
          <View style={styles.cardFooter}>
            <Text style={styles.accountNumberText}>{account.maskedNumber}</Text>
            <View style={styles.tierPill}>
              <Text style={styles.tierText}>Premium Elite</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* 3. Quick Action Buttons Grid (Send Money, Pay Bills, Top Up, More) */}
      <View style={styles.quickActionsContainer}>
        <TouchableOpacity
          style={styles.actionItem}
          onPress={onNavigateToTransfers}
          activeOpacity={0.8}
        >
          <View style={[styles.actionIconCircle, Colors.shadows.soft]}>
            <ArrowUpRight size={24} color={Colors.electricBlue} strokeWidth={2.2} />
          </View>
          <Text style={styles.actionLabel}>Send Money</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionItem}
          onPress={onNavigateToBills}
          activeOpacity={0.8}
        >
          <View style={[styles.actionIconCircle, Colors.shadows.soft]}>
            <FileText size={24} color={Colors.electricBlue} strokeWidth={2.2} />
          </View>
          <Text style={styles.actionLabel}>Pay Bills</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionItem}
          onPress={onNavigateToCards}
          activeOpacity={0.8}
        >
          <View style={[styles.actionIconCircle, Colors.shadows.soft]}>
            <Smartphone size={24} color={Colors.electricBlue} strokeWidth={2.2} />
          </View>
          <Text style={styles.actionLabel}>Top Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionItem}
          onPress={onNavigateToCards}
          activeOpacity={0.8}
        >
          <View style={[styles.actionIconCircle, Colors.shadows.soft]}>
            <LayoutGrid size={24} color={Colors.electricBlue} strokeWidth={2.2} />
          </View>
          <Text style={styles.actionLabel}>More</Text>
        </TouchableOpacity>
      </View>

      {/* 4. Recent Activity Section */}
      <View style={styles.recentSection}>
        <View style={styles.recentHeader}>
          <Text style={styles.recentTitle}>Recent Activity</Text>
          <TouchableOpacity onPress={onNavigateToTransactions} style={styles.seeAllBtn}>
            <Text style={styles.seeAllText}>See All</Text>
            <ChevronRight size={16} color={Colors.electricBlue} />
          </TouchableOpacity>
        </View>

        {/* Transactions List */}
        <View style={styles.transactionsList}>
          {transactions.slice(0, 4).map((tx) => {
            const isCredit = tx.type === 'credit';
            return (
              <TouchableOpacity
                key={tx.id}
                style={styles.transactionCard}
                onPress={onNavigateToTransactions}
                activeOpacity={0.85}
              >
                <View style={styles.txLeft}>
                  {/* Round status icon (Green for inflow, Red for outflow) */}
                  <View
                    style={[
                      styles.txIconBox,
                      { backgroundColor: isCredit ? '#E8F8F2' : '#FDE8E8' },
                    ]}
                  >
                    {isCredit ? (
                      <ArrowDownLeft size={20} color={Colors.successGreen} strokeWidth={2.5} />
                    ) : (
                      <ArrowUpRight size={20} color={Colors.errorRed} strokeWidth={2.5} />
                    )}
                  </View>

                  <View style={styles.txDetails}>
                    <Text style={styles.txTitle}>{tx.title}</Text>
                    <Text style={styles.txDate}>{tx.date}, {tx.time}</Text>
                  </View>
                </View>

                {/* Amount */}
                <Text
                  style={[
                    styles.txAmount,
                    { color: isCredit ? Colors.successGreen : Colors.errorRed },
                  ]}
                >
                  {isCredit ? '+' : '-'} PKR {tx.amount.toLocaleString()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FC',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greetingTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primaryNavy,
  },
  greetingSub: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  notifBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  notifBadge: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.errorRed,
  },
  avatarBorder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: Colors.electricBlue,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  balanceCardWrapper: {
    borderRadius: 22,
    marginBottom: 24,
  },
  balanceCard: {
    borderRadius: 22,
    padding: 22,
    height: 175,
    justifyContent: 'space-between',
  },
  balanceTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '600',
  },
  balanceAmountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 4,
  },
  currencyPrefix: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountNumberText: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 13,
    letterSpacing: 1,
  },
  tierPill: {
    backgroundColor: 'rgba(24, 184, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tierText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  actionItem: {
    alignItems: 'center',
    gap: 8,
  },
  actionIconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primaryNavy,
  },
  recentSection: {
    marginBottom: 20,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primaryNavy,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.electricBlue,
  },
  transactionsList: {
    gap: 12,
  },
  transactionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  txLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  txIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txDetails: {},
  txTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primaryNavy,
  },
  txDate: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginTop: 3,
  },
  txAmount: {
    fontSize: 15,
    fontWeight: '700',
  },
});
