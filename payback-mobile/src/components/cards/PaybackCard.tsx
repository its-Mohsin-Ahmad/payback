import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { Colors } from '../../theme/colors';
import { VirtualCard } from '../../types';
import { Eye, EyeOff, ShieldCheck, Snowflake } from 'lucide-react-native';

interface PaybackCardProps {
  card: VirtualCard;
  onPress?: () => void;
  showDetailsToggle?: boolean;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;
const CARD_HEIGHT = CARD_WIDTH * 0.62;

export const PaybackCard: React.FC<PaybackCardProps> = ({
  card,
  onPress,
  showDetailsToggle = true,
}) => {
  const [showFullNumber, setShowFullNumber] = useState(false);

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={onPress}
      style={[styles.cardContainer, Colors.shadows.card]}
    >
      <LinearGradient
        colors={card.isFrozen ? ['#334155', '#1E293B'] : ['#0878F9', '#0A2552', '#061735']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGradient}
      >
        {/* Subtle decorative wave curves */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Svg width={CARD_WIDTH} height={CARD_HEIGHT} viewBox="0 0 340 210">
            <Path
              d="M-20,180 C80,120 180,240 360,110 L360,210 L-20,210 Z"
              fill="rgba(24, 184, 255, 0.08)"
            />
            <Path
              d="M-20,90 C120,40 220,160 360,60 L360,0 L-20,0 Z"
              fill="rgba(255, 255, 255, 0.04)"
            />
          </Svg>
        </View>

        {/* Top Header: Brand + Contactless */}
        <View style={styles.topRow}>
          <View style={styles.brandRow}>
            {/* Mini 'P' Icon */}
            <View style={styles.miniLogo}>
              <Text style={styles.miniLogoText}>P</Text>
            </View>
            <Text style={styles.cardBrandText}>PAYBACK</Text>
          </View>

          {/* Contactless waves & Frozen badge */}
          <View style={styles.topRightIcons}>
            {card.isFrozen ? (
              <View style={styles.frozenBadge}>
                <Snowflake size={14} color="#38BDF8" />
                <Text style={styles.frozenText}>FROZEN</Text>
              </View>
            ) : (
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M14 6C16.2 8.2 16.2 11.8 14 14"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <Path
                  d="M17.5 3C21 6.5 21 13.5 17.5 17"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity={0.7}
                />
                <Path
                  d="M10.5 9C11.5 10 11.5 12 10.5 13"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </Svg>
            )}
          </View>
        </View>

        {/* EMV Gold Chip */}
        <View style={styles.chipRow}>
          <View style={styles.emvChip}>
            <View style={styles.chipInnerGrid} />
            <View style={styles.chipLine1} />
            <View style={styles.chipLine2} />
          </View>

          {showDetailsToggle && (
            <TouchableOpacity
              onPress={() => setShowFullNumber(!showFullNumber)}
              style={styles.eyeToggleBtn}
            >
              {showFullNumber ? (
                <EyeOff size={18} color="#FFFFFF" opacity={0.8} />
              ) : (
                <Eye size={18} color="#FFFFFF" opacity={0.8} />
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Card Number */}
        <View style={styles.numberRow}>
          <Text style={styles.cardNumber}>
            {showFullNumber ? card.cardNumberFull : card.cardNumberMasked}
          </Text>
        </View>

        {/* Card Footer: Holder, Expiry, Brand logo */}
        <View style={styles.bottomRow}>
          <View>
            <Text style={styles.labelSub}>CARD HOLDER</Text>
            <Text style={styles.cardholderName}>{card.cardholderName}</Text>
          </View>

          <View style={styles.expiryBox}>
            <Text style={styles.labelSub}>EXPIRES</Text>
            <Text style={styles.expiryDate}>{card.expiryDate}</Text>
          </View>

          {/* VISA logo */}
          <View style={styles.visaContainer}>
            <Text style={styles.visaText}>VISA</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 22,
    marginVertical: 12,
    overflow: 'hidden',
  },
  cardGradient: {
    flex: 1,
    padding: 22,
    justifyContent: 'space-between',
    borderRadius: 22,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  miniLogo: {
    width: 26,
    height: 26,
    borderRadius: 7,
    backgroundColor: Colors.brightBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniLogoText: {
    color: '#061735',
    fontSize: 16,
    fontWeight: '900',
  },
  cardBrandText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 2,
  },
  topRightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  frozenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  frozenText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  chipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  emvChip: {
    width: 44,
    height: 34,
    borderRadius: 7,
    backgroundColor: '#E2B842',
    borderWidth: 1,
    borderColor: '#C69926',
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipInnerGrid: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: '#A87910',
    borderRadius: 3,
  },
  chipLine1: {
    position: 'absolute',
    top: 16,
    width: '100%',
    height: 1,
    backgroundColor: '#A87910',
  },
  chipLine2: {
    position: 'absolute',
    left: 21,
    height: '100%',
    width: 1,
    backgroundColor: '#A87910',
  },
  eyeToggleBtn: {
    padding: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 8,
  },
  numberRow: {
    marginTop: 4,
  },
  cardNumber: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 3.5,
    fontFamily: 'monospace',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  labelSub: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 2,
  },
  cardholderName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  expiryBox: {
    alignItems: 'center',
  },
  expiryDate: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
  },
  visaContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  visaText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: 1,
  },
});
