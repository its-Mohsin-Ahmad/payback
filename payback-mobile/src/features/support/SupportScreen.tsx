import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Colors } from '../../theme/colors';
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Mail,
  PhoneCall,
  Send,
  HelpCircle,
} from 'lucide-react-native';

interface SupportScreenProps {
  onGoBack: () => void;
}

const FAQS = [
  {
    q: 'How do I freeze or unfreeze my PAYBACK card?',
    a: 'Navigate to the "Cards" tab in the bottom menu. Toggle the "Freeze Card" switch at the top. The change takes effect instantly with zero downtime.',
  },
  {
    q: 'Are money transfers to other banks instant?',
    a: 'Yes, PAYBACK uses direct instant interbank settlement rails (1-LINK & RAAST). Your recipient will see the credit within seconds.',
  },
  {
    q: 'What are the daily transaction limits?',
    a: 'Standard accounts have a PKR 100,000/day limit, while Premium Elite accounts enjoy up to PKR 500,000/day. You can customize your limit in Card Settings.',
  },
  {
    q: 'How does PAYBACK protect my account security?',
    a: 'We implement hardware-backed biometric verification, TLS 1.3 encryption, instant suspicious activity alerts, and strict multi-factor session validation.',
  },
];

export const SupportScreen: React.FC<SupportScreenProps> = ({ onGoBack }) => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitTicket = () => {
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      Alert.alert('Incomplete Form', 'Please enter both subject and message.');
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setTicketSubject('');
      setTicketMessage('');
      Alert.alert('Ticket Submitted', 'Ticket #PB-84920 received. A priority agent will respond shortly.');
    }, 800);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backBtn}>
          <ArrowLeft size={22} color={Colors.primaryNavy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Quick Contact Options */}
        <View style={styles.quickContactRow}>
          <TouchableOpacity
            style={styles.contactCard}
            onPress={() => Alert.alert('Live Chat', 'Connecting to 24/7 Priority Support concierge...')}
            activeOpacity={0.8}
          >
            <View style={[styles.contactIcon, { backgroundColor: '#E0F2FE' }]}>
              <MessageCircle size={22} color={Colors.electricBlue} />
            </View>
            <Text style={styles.contactTitle}>Live Chat</Text>
            <Text style={styles.contactSub}>24/7 Available</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactCard}
            onPress={() => Alert.alert('Email Support', 'Direct inquiries: support@payback.fintech')}
            activeOpacity={0.8}
          >
            <View style={[styles.contactIcon, { backgroundColor: '#ECFDF5' }]}>
              <Mail size={22} color="#10B981" />
            </View>
            <Text style={styles.contactTitle}>Email Us</Text>
            <Text style={styles.contactSub}>&lt; 2hr Response</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactCard}
            onPress={() => Alert.alert('Helpline', 'Toll-free 24/7: 0800-PAYBACK (729222)')}
            activeOpacity={0.8}
          >
            <View style={[styles.contactIcon, { backgroundColor: '#FEF3C7' }]}>
              <PhoneCall size={22} color="#D97706" />
            </View>
            <Text style={styles.contactTitle}>Helpline</Text>
            <Text style={styles.contactSub}>Toll-free</Text>
          </TouchableOpacity>
        </View>

        {/* FAQs */}
        <Text style={styles.sectionHeading}>Frequently Asked Questions</Text>
        <View style={styles.faqList}>
          {FAQS.map((faq, index) => {
            const isExpanded = expandedFaq === index;
            return (
              <TouchableOpacity
                key={index}
                style={styles.faqItem}
                onPress={() => setExpandedFaq(isExpanded ? null : index)}
                activeOpacity={0.85}
              >
                <View style={styles.faqQuestionRow}>
                  <Text style={styles.faqQuestion}>{faq.q}</Text>
                  {isExpanded ? (
                    <ChevronUp size={18} color={Colors.electricBlue} />
                  ) : (
                    <ChevronDown size={18} color={Colors.secondaryText} />
                  )}
                </View>
                {isExpanded && <Text style={styles.faqAnswer}>{faq.a}</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Submit Ticket */}
        <Text style={styles.sectionHeading}>Send a Support Request</Text>
        <View style={styles.ticketCard}>
          <TextInput
            style={styles.ticketInput}
            placeholder="Subject / Issue Summary"
            placeholderTextColor="#94A3B8"
            value={ticketSubject}
            onChangeText={setTicketSubject}
          />
          <TextInput
            style={[styles.ticketInput, styles.ticketTextarea]}
            placeholder="Describe your issue or feedback in detail..."
            placeholderTextColor="#94A3B8"
            value={ticketMessage}
            onChangeText={setTicketMessage}
            multiline
            numberOfLines={4}
          />
          <TouchableOpacity
            style={[styles.submitBtn, Colors.shadows.button]}
            onPress={handleSubmitTicket}
            activeOpacity={0.88}
          >
            <Send size={16} color="#FFFFFF" />
            <Text style={styles.submitBtnText}>Submit Request</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7FC' },
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
  headerTitle: { fontSize: 18, fontWeight: '800', color: Colors.primaryNavy },
  scrollContent: { paddingHorizontal: 20, paddingVertical: 20, paddingBottom: 40 },
  quickContactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 24,
  },
  contactCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  contactIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  contactTitle: { fontSize: 13, fontWeight: '700', color: Colors.primaryNavy },
  contactSub: { fontSize: 10, color: Colors.secondaryText, marginTop: 2 },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primaryNavy,
    marginBottom: 12,
  },
  faqList: { gap: 10, marginBottom: 24 },
  faqItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  faqQuestionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryNavy,
    marginRight: 10,
  },
  faqAnswer: {
    fontSize: 13,
    color: Colors.secondaryText,
    marginTop: 10,
    lineHeight: 19,
  },
  ticketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  ticketInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 14,
    color: Colors.primaryNavy,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  ticketTextarea: {
    height: 100,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: Colors.electricBlue,
    height: 48,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
