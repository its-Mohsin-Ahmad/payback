import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Switch, Alert,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { useBankStore } from '../../store/useBankStore';
import { PaybackCard } from '../../components/cards/PaybackCard';
import {
  ArrowLeft, Snowflake, KeyRound, Gauge, CreditCard, ChevronRight,
} from 'lucide-react-native';

interface CardsScreenProps {
  onGoBack: () => void;
}

export const CardsScreen: React.FC<CardsScreenProps> = ({ onGoBack }) => {
  const { card, toggleFreezeCard } = useBankStore();

  const cardSettings = [
    {
      icon: Snowflake,
      label: 'Freeze Card',
      subtitle: card.isFrozen ? 'Card is currently frozen' : 'Temporarily disable your card',
      isSwitch: true,
      switchValue: card.isFrozen,
      onToggle: toggleFreezeCard,
      color: '#38BDF8',
    },
    {
      icon: KeyRound,
      label: 'Change PIN',
      subtitle: 'Update your 4-digit card PIN',
      onPress: () => Alert.alert('Change PIN', 'This feature requires backend verification. Demo mode.'),
      color: '#F59E0B',
    },
    {
      icon: Gauge,
      label: 'Set Limits',
      subtitle: `Daily limit: PKR ${card.dailyLimit.toLocaleString()}`,
      onPress: () => Alert.alert('Set Limits', 'Adjust your daily spending limit.'),
      color: '#10B981',
    },
    {
      icon: CreditCard,
      label: 'Card Details',
      subtitle: 'View full card information',
      onPress: () => Alert.alert('Card Details', `Card: ${card.cardNumberFull}\nExpiry: ${card.expiryDate}\nCVV: ${card.cvv}\n\n⚠️ Never share these details.`),
      color: Colors.electricBlue,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backBtn}>
          <ArrowLeft size={22} color={Colors.primaryNavy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cards</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Virtual Card */}
        <View style={styles.cardWrapper}>
          <PaybackCard card={card} />
        </View>

        {/* Spending Progress */}
        <View style={styles.spendingCard}>
          <View style={styles.spendingHeader}>
            <Text style={styles.spendingLabel}>Daily Spending</Text>
            <Text style={styles.spendingAmount}>
              PKR {card.currentSpend.toLocaleString()} / {card.dailyLimit.toLocaleString()}
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min((card.currentSpend / card.dailyLimit) * 100, 100)}%` },
              ]}
            />
          </View>
        </View>

        {/* Card Settings */}
        <Text style={styles.sectionTitle}>Card Settings</Text>
        {cardSettings.map((setting, index) => {
          const IconComp = setting.icon;
          return (
            <TouchableOpacity
              key={index}
              style={styles.settingRow}
              activeOpacity={setting.isSwitch ? 1 : 0.8}
              onPress={setting.isSwitch ? undefined : setting.onPress}
            >
              <View style={[styles.settingIcon, { backgroundColor: setting.color + '15' }]}>
                <IconComp size={20} color={setting.color} />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>{setting.label}</Text>
                <Text style={styles.settingSub}>{setting.subtitle}</Text>
              </View>
              {setting.isSwitch ? (
                <Switch
                  value={setting.switchValue}
                  onValueChange={setting.onToggle}
                  trackColor={{ false: '#E2E8F0', true: Colors.electricBlue }}
                  thumbColor="#FFFFFF"
                />
              ) : (
                <ChevronRight size={20} color={Colors.secondaryText} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7FC' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 14,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center', elevation: 2,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: Colors.primaryNavy },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 30 },
  cardWrapper: { alignItems: 'center', marginBottom: 8 },
  spendingCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 24,
    elevation: 1,
  },
  spendingHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10,
  },
  spendingLabel: { fontSize: 14, fontWeight: '600', color: Colors.primaryNavy },
  spendingAmount: { fontSize: 12, fontWeight: '600', color: Colors.secondaryText },
  progressTrack: {
    height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, overflow: 'hidden',
  },
  progressFill: {
    height: '100%', backgroundColor: Colors.electricBlue, borderRadius: 3,
  },
  sectionTitle: {
    fontSize: 16, fontWeight: '800', color: Colors.primaryNavy, marginBottom: 14,
  },
  settingRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    borderRadius: 14, padding: 16, marginBottom: 10, elevation: 1,
  },
  settingIcon: {
    width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
  },
  settingText: { flex: 1, marginLeft: 14 },
  settingLabel: { fontSize: 15, fontWeight: '700', color: Colors.primaryNavy },
  settingSub: { fontSize: 12, color: Colors.secondaryText, marginTop: 2 },
});
