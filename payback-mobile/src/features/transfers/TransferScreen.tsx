import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity,
  TextInput, Alert, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../theme/colors';
import { useBankStore } from '../../store/useBankStore';
import {
  ArrowLeft, ArrowUpRight, User, Hash, DollarSign, FileText, ChevronRight,
} from 'lucide-react-native';

interface TransferScreenProps {
  onGoBack: () => void;
}

export const TransferScreen: React.FC<TransferScreenProps> = ({ onGoBack }) => {
  const { sendMoney, account } = useBankStore();
  const [recipientName, setRecipientName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'confirm' | 'success'>('form');
  const [lastTxId, setLastTxId] = useState('');

  const parsedAmount = parseFloat(amount) || 0;

  const handleReview = () => {
    if (!recipientName.trim()) { Alert.alert('Missing', 'Enter recipient name'); return; }
    if (!accountNumber.trim()) { Alert.alert('Missing', 'Enter account number'); return; }
    if (parsedAmount <= 0) { Alert.alert('Invalid', 'Enter a valid amount'); return; }
    if (parsedAmount > account.balance) { Alert.alert('Insufficient', 'Not enough balance'); return; }
    setStep('confirm');
  };

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      const result = sendMoney({ recipientName, accountNumber, amount: parsedAmount, note });
      setLoading(false);
      if (result.success) {
        setLastTxId(result.transactionId || '');
        setStep('success');
      } else {
        Alert.alert('Transfer Failed', result.message);
      }
    }, 1200);
  };

  // ── Success Screen ──
  if (step === 'success') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successScreen}>
          <View style={styles.successCircle}>
            <ArrowUpRight size={40} color="#FFFFFF" />
          </View>
          <Text style={styles.successTitle}>Transfer Successful!</Text>
          <Text style={styles.successAmount}>PKR {parsedAmount.toLocaleString()}</Text>
          <Text style={styles.successSub}>sent to {recipientName}</Text>
          <Text style={styles.successRef}>Ref: {lastTxId}</Text>
          <TouchableOpacity style={styles.doneBtn} onPress={onGoBack}>
            <Text style={styles.doneBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Confirm Screen ──
  if (step === 'confirm') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setStep('form')} style={styles.backBtn}>
            <ArrowLeft size={22} color={Colors.primaryNavy} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Confirm Transfer</Text>
          <View style={{ width: 40 }} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.confirmCard}>
            <View style={styles.confirmRow}>
              <Text style={styles.confirmLabel}>Recipient</Text>
              <Text style={styles.confirmValue}>{recipientName}</Text>
            </View>
            <View style={styles.confirmRow}>
              <Text style={styles.confirmLabel}>Account</Text>
              <Text style={styles.confirmValue}>{accountNumber}</Text>
            </View>
            <View style={styles.confirmRow}>
              <Text style={styles.confirmLabel}>Amount</Text>
              <Text style={[styles.confirmValue, { color: Colors.electricBlue, fontWeight: '800' }]}>
                PKR {parsedAmount.toLocaleString()}
              </Text>
            </View>
            {note ? (
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Note</Text>
                <Text style={styles.confirmValue}>{note}</Text>
              </View>
            ) : null}
            <View style={styles.confirmRow}>
              <Text style={styles.confirmLabel}>Fee</Text>
              <Text style={[styles.confirmValue, { color: Colors.successGreen }]}>FREE</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.confirmBtn, Colors.shadows.button]}
            onPress={handleConfirm}
            disabled={loading}
            activeOpacity={0.88}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.confirmBtnText}>Confirm & Send</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Form Screen ──
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backBtn}>
          <ArrowLeft size={22} color={Colors.primaryNavy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Money Transfer</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero Banner */}
        <LinearGradient
          colors={['#0878F9', '#061735']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroBanner}
        >
          <ArrowUpRight size={32} color="#FFFFFF" />
          <View style={{ marginLeft: 14 }}>
            <Text style={styles.heroTitle}>Send Money</Text>
            <Text style={styles.heroSub}>Securely & Instantly</Text>
          </View>
        </LinearGradient>

        <Text style={styles.heroCaption}>Transfer money to anyone{'\n'}in just a few taps.</Text>

        {/* Transfer Form Fields */}
        <View style={styles.form}>
          <View style={styles.inputWrapper}>
            <User size={20} color={Colors.secondaryText} style={{ marginRight: 12 }} />
            <TextInput
              style={styles.textInput}
              placeholder="Recipient Name"
              placeholderTextColor="#94A3B8"
              value={recipientName}
              onChangeText={setRecipientName}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Hash size={20} color={Colors.secondaryText} style={{ marginRight: 12 }} />
            <TextInput
              style={styles.textInput}
              placeholder="Account / IBAN Number"
              placeholderTextColor="#94A3B8"
              value={accountNumber}
              onChangeText={setAccountNumber}
            />
          </View>
          <View style={styles.inputWrapper}>
            <DollarSign size={20} color={Colors.secondaryText} style={{ marginRight: 12 }} />
            <TextInput
              style={styles.textInput}
              placeholder="Amount (PKR)"
              placeholderTextColor="#94A3B8"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputWrapper}>
            <FileText size={20} color={Colors.secondaryText} style={{ marginRight: 12 }} />
            <TextInput
              style={styles.textInput}
              placeholder="Note (optional)"
              placeholderTextColor="#94A3B8"
              value={note}
              onChangeText={setNote}
            />
          </View>
        </View>

        {/* Available Balance Info */}
        <View style={styles.balanceInfo}>
          <Text style={styles.balanceInfoLabel}>Available Balance:</Text>
          <Text style={styles.balanceInfoValue}>PKR {account.balance.toLocaleString()}</Text>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[styles.continueBtn, Colors.shadows.button]}
          onPress={handleReview}
          activeOpacity={0.88}
        >
          <Text style={styles.continueBtnText}>Continue</Text>
          <ChevronRight size={20} color="#FFFFFF" />
        </TouchableOpacity>
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
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  heroBanner: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 18, padding: 24,
    marginBottom: 14,
  },
  heroTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '800' },
  heroSub: { color: 'rgba(255,255,255,0.75)', fontSize: 14, fontWeight: '500', marginTop: 2 },
  heroCaption: {
    textAlign: 'center', color: Colors.secondaryText, fontSize: 14, lineHeight: 20,
    marginBottom: 24,
  },
  form: { gap: 14, marginBottom: 16 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 16, height: 54,
  },
  textInput: { flex: 1, fontSize: 15, color: Colors.primaryNavy, fontWeight: '500' },
  balanceInfo: {
    flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12,
    paddingHorizontal: 4,
  },
  balanceInfoLabel: { fontSize: 13, color: Colors.secondaryText, fontWeight: '500' },
  balanceInfoValue: { fontSize: 13, color: Colors.successGreen, fontWeight: '700' },
  continueBtn: {
    backgroundColor: Colors.electricBlue, height: 54, borderRadius: 27,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8,
  },
  continueBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  // Confirm
  confirmCard: {
    backgroundColor: '#FFFFFF', borderRadius: 18, padding: 20, marginBottom: 20, elevation: 1,
  },
  confirmRow: {
    flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  confirmLabel: { fontSize: 14, color: Colors.secondaryText, fontWeight: '500' },
  confirmValue: { fontSize: 14, color: Colors.primaryNavy, fontWeight: '600' },
  confirmBtn: {
    backgroundColor: Colors.electricBlue, height: 54, borderRadius: 27,
    alignItems: 'center', justifyContent: 'center',
  },
  confirmBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  // Success
  successScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  successCircle: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.successGreen,
    alignItems: 'center', justifyContent: 'center', marginBottom: 24,
  },
  successTitle: { fontSize: 22, fontWeight: '800', color: Colors.primaryNavy, marginBottom: 8 },
  successAmount: { fontSize: 28, fontWeight: '800', color: Colors.electricBlue },
  successSub: { fontSize: 14, color: Colors.secondaryText, marginTop: 4 },
  successRef: { fontSize: 12, color: Colors.secondaryText, marginTop: 12 },
  doneBtn: {
    backgroundColor: Colors.electricBlue, paddingHorizontal: 36, paddingVertical: 14,
    borderRadius: 25, marginTop: 30,
  },
  doneBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
