import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity,
  TextInput, Alert, FlatList,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { useBankStore } from '../../store/useBankStore';
import {
  ArrowLeft, Search, Zap, Droplet, Wifi, Flame, Phone, MoreHorizontal, ChevronRight,
} from 'lucide-react-native';
import { BillCategory } from '../../types';

interface BillPaymentsScreenProps {
  onGoBack: () => void;
}

const CATEGORIES: BillCategory[] = [
  { id: 'electricity', name: 'Electricity', iconName: 'zap', color: '#F59E0B' },
  { id: 'water', name: 'Water', iconName: 'droplet', color: '#3B82F6' },
  { id: 'internet', name: 'Internet', iconName: 'wifi', color: '#8B5CF6' },
  { id: 'gas', name: 'Gas', iconName: 'flame', color: '#EF4444' },
  { id: 'phone', name: 'Phone', iconName: 'phone', color: '#10B981' },
  { id: 'more', name: 'More', iconName: 'more-horizontal', color: Colors.secondaryText },
];

const ICON_MAP: Record<string, React.FC<any>> = {
  zap: Zap, droplet: Droplet, wifi: Wifi, flame: Flame, phone: Phone,
  'more-horizontal': MoreHorizontal,
};

export const BillPaymentsScreen: React.FC<BillPaymentsScreenProps> = ({ onGoBack }) => {
  const { bills, payBill } = useBankStore();
  const [searchQuery, setSearchQuery] = useState('');

  const handlePayBill = (billId: string) => {
    Alert.alert('Confirm Payment', 'Pay this bill now?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Pay Now',
        onPress: () => {
          const result = payBill(billId);
          Alert.alert(result.success ? '✅ Success' : '❌ Error', result.message);
        },
      },
    ]);
  };

  const unpaidBills = bills.filter(
    (b) =>
      b.status !== 'paid' &&
      (!searchQuery || b.providerName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backBtn}>
          <ArrowLeft size={22} color={Colors.primaryNavy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bill Payments</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Search */}
        <View style={styles.searchBar}>
          <Search size={18} color={Colors.secondaryText} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search bills..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Category Grid */}
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((cat) => {
            const IconComp = ICON_MAP[cat.iconName] || MoreHorizontal;
            return (
              <TouchableOpacity key={cat.id} style={styles.categoryItem} activeOpacity={0.8}>
                <View style={[styles.categoryIcon, { backgroundColor: cat.color + '18' }]}>
                  <IconComp size={24} color={cat.color} />
                </View>
                <Text style={styles.categoryLabel}>{cat.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Recent Bills */}
        <View style={styles.recentBillsHeader}>
          <Text style={styles.sectionTitle}>Recent Bills</Text>
          <TouchableOpacity style={styles.seeAllBtn}>
            <Text style={styles.seeAllText}>See All</Text>
            <ChevronRight size={16} color={Colors.electricBlue} />
          </TouchableOpacity>
        </View>

        {unpaidBills.map((bill) => {
          const IconComp = ICON_MAP[bill.icon] || Zap;
          return (
            <View key={bill.id} style={styles.billCard}>
              <View style={styles.billLeft}>
                <View style={[styles.billIcon, { backgroundColor: '#F59E0B18' }]}>
                  <IconComp size={22} color="#F59E0B" />
                </View>
                <View style={styles.billInfo}>
                  <Text style={styles.billName}>{bill.providerName}</Text>
                  <Text style={styles.billAmount}>PKR {bill.amount.toLocaleString()}</Text>
                  <Text style={styles.billDue}>{bill.dueDate}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.payBtn}
                onPress={() => handlePayBill(bill.id)}
                activeOpacity={0.85}
              >
                <Text style={styles.payBtnText}>Pay</Text>
              </TouchableOpacity>
            </View>
          );
        })}

        {unpaidBills.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>All bills paid! 🎉</Text>
          </View>
        )}
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
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    borderRadius: 14, paddingHorizontal: 14, height: 48, marginBottom: 20,
    borderWidth: 1, borderColor: '#E2E8F0',
  },
  searchInput: { flex: 1, fontSize: 14, color: Colors.primaryNavy, marginLeft: 10 },
  categoryGrid: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between',
    marginBottom: 24, gap: 12,
  },
  categoryItem: { width: '30%', alignItems: 'center', gap: 8 },
  categoryIcon: {
    width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center',
  },
  categoryLabel: { fontSize: 12, fontWeight: '600', color: Colors.primaryNavy },
  recentBillsHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14,
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: Colors.primaryNavy },
  seeAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  seeAllText: { fontSize: 13, fontWeight: '700', color: Colors.electricBlue },
  billCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, marginBottom: 10, elevation: 1,
  },
  billLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  billIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  billInfo: { marginLeft: 12, flex: 1 },
  billName: { fontSize: 14, fontWeight: '700', color: Colors.primaryNavy },
  billAmount: { fontSize: 13, fontWeight: '600', color: Colors.electricBlue, marginTop: 2 },
  billDue: { fontSize: 11, color: Colors.secondaryText, marginTop: 1 },
  payBtn: {
    backgroundColor: Colors.electricBlue, paddingHorizontal: 22, paddingVertical: 10,
    borderRadius: 20,
  },
  payBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 15, color: Colors.secondaryText },
});
