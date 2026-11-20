import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { useBankStore } from '../../store/useBankStore';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Filter,
  ArrowLeft,
  Receipt,
} from 'lucide-react-native';
import { Transaction } from '../../types';

interface TransactionsScreenProps {
  onGoBack: () => void;
}

type TxFilter = 'all' | 'income' | 'expense';

export const TransactionsScreen: React.FC<TransactionsScreenProps> = ({ onGoBack }) => {
  const { transactions } = useBankStore();
  const [filter, setFilter] = useState<TxFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const filtered = transactions.filter((tx) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'income' && tx.type === 'credit') ||
      (filter === 'expense' && tx.type === 'debit');
    const matchesSearch =
      !searchQuery ||
      tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.counterparty.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const renderTransaction = ({ item }: { item: Transaction }) => {
    const isCredit = item.type === 'credit';
    return (
      <TouchableOpacity
        style={styles.txCard}
        activeOpacity={0.85}
        onPress={() => setSelectedTx(selectedTx?.id === item.id ? null : item)}
      >
        <View style={styles.txRow}>
          <View style={[styles.txIcon, { backgroundColor: isCredit ? '#E8F8F2' : '#FDE8E8' }]}>
            {isCredit ? (
              <ArrowDownLeft size={20} color={Colors.successGreen} strokeWidth={2.5} />
            ) : (
              <ArrowUpRight size={20} color={Colors.errorRed} strokeWidth={2.5} />
            )}
          </View>
          <View style={styles.txInfo}>
            <Text style={styles.txTitle}>{item.title}</Text>
            <Text style={styles.txSub}>{item.counterparty}</Text>
            <Text style={styles.txDate}>{item.date} • {item.time}</Text>
          </View>
          <View style={styles.txRight}>
            <Text style={[styles.txAmount, { color: isCredit ? Colors.successGreen : Colors.errorRed }]}>
              {isCredit ? '+' : '-'} PKR {item.amount.toLocaleString()}
            </Text>
            <View style={[styles.statusBadge, {
              backgroundColor: item.status === 'completed' ? '#E8F8F2' : item.status === 'pending' ? '#FEF3C7' : '#FDE8E8'
            }]}>
              <Text style={[styles.statusText, {
                color: item.status === 'completed' ? Colors.successGreen : item.status === 'pending' ? '#D97706' : Colors.errorRed
              }]}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </View>
          </View>
        </View>

        {/* Expanded Detail */}
        {selectedTx?.id === item.id && (
          <View style={styles.txExpandedDetail}>
            <View style={styles.detailDivider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Reference ID</Text>
              <Text style={styles.detailValue}>{item.referenceId}</Text>
            </View>
            {item.fee > 0 && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Service Fee</Text>
                <Text style={styles.detailValue}>PKR {item.fee}</Text>
              </View>
            )}
            {item.note && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Note</Text>
                <Text style={styles.detailValue}>{item.note}</Text>
              </View>
            )}
            <TouchableOpacity style={styles.receiptBtn}>
              <Receipt size={16} color={Colors.electricBlue} />
              <Text style={styles.receiptBtnText}>Download Receipt</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backBtn}>
          <ArrowLeft size={22} color={Colors.primaryNavy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transactions</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Search size={18} color={Colors.secondaryText} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search transactions..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity>
          <Filter size={18} color={Colors.secondaryText} />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {(['all', 'income', 'expense'] as TxFilter[]).map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
          >
            <Text style={[styles.filterTabText, filter === f && styles.filterTabTextActive]}>
              {f === 'all' ? 'All' : f === 'income' ? 'Income' : 'Expenses'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Transaction List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderTransaction}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No transactions found</Text>
          </View>
        }
      />
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
  searchBar: {
    flexDirection: 'row', alignItems: 'center', marginHorizontal: 20,
    backgroundColor: '#FFFFFF', borderRadius: 14, paddingHorizontal: 14, height: 48,
    marginBottom: 14, borderWidth: 1, borderColor: '#E2E8F0',
  },
  searchInput: { flex: 1, fontSize: 14, color: Colors.primaryNavy, marginLeft: 10 },
  filterRow: {
    flexDirection: 'row', marginHorizontal: 20, marginBottom: 14, gap: 10,
  },
  filterTab: {
    paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0',
  },
  filterTabActive: { backgroundColor: Colors.electricBlue, borderColor: Colors.electricBlue },
  filterTabText: { fontSize: 13, fontWeight: '600', color: Colors.secondaryText },
  filterTabTextActive: { color: '#FFFFFF' },
  listContent: { paddingHorizontal: 20, paddingBottom: 30 },
  txCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 10,
    elevation: 1, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6,
  },
  txRow: { flexDirection: 'row', alignItems: 'center' },
  txIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  txInfo: { flex: 1, marginLeft: 14 },
  txTitle: { fontSize: 15, fontWeight: '700', color: Colors.primaryNavy },
  txSub: { fontSize: 12, color: Colors.secondaryText, marginTop: 1 },
  txDate: { fontSize: 11, color: Colors.secondaryText, marginTop: 2 },
  txRight: { alignItems: 'flex-end' },
  txAmount: { fontSize: 15, fontWeight: '700' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, marginTop: 4 },
  statusText: { fontSize: 10, fontWeight: '700' },
  txExpandedDetail: { marginTop: 12 },
  detailDivider: { height: 1, backgroundColor: '#E2E8F0', marginBottom: 10 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  detailLabel: { fontSize: 12, color: Colors.secondaryText, fontWeight: '500' },
  detailValue: { fontSize: 12, color: Colors.primaryNavy, fontWeight: '600' },
  receiptBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 10, borderRadius: 10, backgroundColor: 'rgba(8,120,249,0.06)', marginTop: 4,
  },
  receiptBtnText: { fontSize: 13, fontWeight: '600', color: Colors.electricBlue },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 15, color: Colors.secondaryText },
});
