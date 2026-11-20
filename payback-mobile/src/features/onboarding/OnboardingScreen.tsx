import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path, Rect, Circle, Polygon } from 'react-native-svg';
import { Colors } from '../../theme/colors';
import { ArrowRight } from 'lucide-react-native';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Welcome to\nPAYBACK',
    subtitle: 'Your trusted banking partner for a smarter financial future.',
    badge: 'SMART BANKING',
  },
  {
    id: '2',
    title: 'Instant Global\nTransactions',
    subtitle: 'Send and receive money anytime, anywhere with zero hidden fees.',
    badge: 'ZERO FEES',
  },
  {
    id: '3',
    title: 'Banking Built\nAround You',
    subtitle: 'Total control over virtual cards, bill payments, and smart savings.',
    badge: 'NEXT-GEN CARDS',
  },
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const slide = SLIDES[currentSlide];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Top Header with Skip Button */}
      <View style={styles.header}>
        <View style={styles.pillBadge}>
          <Text style={styles.pillBadgeText}>{slide.badge}</Text>
        </View>

        {currentSlide < SLIDES.length - 1 && (
          <TouchableOpacity onPress={onComplete} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 3D Bank Temple Vector Illustration (matching the reference image) */}
      <View style={styles.illustrationWrapper}>
        <Svg width={width * 0.75} height={width * 0.65} viewBox="0 0 300 240" fill="none">
          {/* Floating Background Glow */}
          <Circle cx="150" cy="130" r="90" fill="#EBF4FE" />

          {/* Floating Left Virtual Card */}
          <Rect
            x="25"
            y="60"
            width="55"
            height="34"
            rx="5"
            transform="rotate(-15 25 60)"
            fill="#0878F9"
          />
          <Circle cx="35" cy="65" r="3" fill="#FFE082" />

          {/* Floating Right Virtual Card */}
          <Rect
            x="225"
            y="45"
            width="60"
            height="36"
            rx="5"
            transform="rotate(18 225 45)"
            fill="#061735"
          />
          <Circle cx="240" cy="55" r="4" fill="#18B8FF" />

          {/* Floating Golden Coin */}
          <Circle cx="45" cy="160" r="14" fill="#FFC107" />
          <Circle cx="45" cy="160" r="10" stroke="#FFA000" strokeWidth="2" fill="#FFD54F" />

          {/* Floating Small Shield */}
          <Path
            d="M250 170 Q250 190 265 200 Q280 190 280 170 L280 160 L250 160 Z"
            fill="#16A875"
          />

          {/* Neoclassical Bank Temple: Roof Triangle Pediment */}
          <Polygon points="70,95 230,95 150,55" fill="#0B2450" />
          <Polygon points="80,95 220,95 150,60" fill="#1E3A8A" />
          <Circle cx="150" cy="80" r="8" fill="#18B8FF" />

          {/* Temple Architrave Beam */}
          <Rect x="75" y="95" width="150" height="12" rx="2" fill="#0878F9" />

          {/* Temple Columns */}
          <Rect x="88" y="107" width="14" height="60" rx="3" fill="#DCE7F6" />
          <Rect x="118" y="107" width="14" height="60" rx="3" fill="#DCE7F6" />
          <Rect x="148" y="107" width="14" height="60" rx="3" fill="#DCE7F6" />
          <Rect x="178" y="107" width="14" height="60" rx="3" fill="#DCE7F6" />
          <Rect x="208" y="107" width="14" height="60" rx="3" fill="#DCE7F6" />

          {/* Central Door & Steps */}
          <Rect x="135" y="130" width="30" height="37" rx="3" fill="#0B2450" />
          <Rect x="65" y="167" width="170" height="10" rx="3" fill="#061735" />
          <Rect x="55" y="177" width="190" height="10" rx="3" fill="#0878F9" />
          <Rect x="45" y="187" width="210" height="12" rx="4" fill="#061735" />
        </Svg>
      </View>

      {/* Content Section */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.subtitle}>{slide.subtitle}</Text>
      </View>

      {/* Bottom Action Area with Dots & Get Started Button */}
      <View style={styles.footer}>
        {/* Pagination Dots */}
        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentSlide ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        {/* Action Button */}
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={handleNext}
          style={[styles.primaryButton, Colors.shadows.button]}
        >
          <Text style={styles.buttonText}>
            {currentSlide === SLIDES.length - 1 ? 'Get Started' : 'Continue'}
          </Text>
          <ArrowRight size={20} color="#FFFFFF" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
  },
  pillBadge: {
    backgroundColor: 'rgba(8, 120, 249, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pillBadgeText: {
    color: Colors.electricBlue,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  skipText: {
    color: Colors.secondaryText,
    fontSize: 14,
    fontWeight: '600',
  },
  illustrationWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  title: {
    color: Colors.primaryNavy,
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 36,
  },
  subtitle: {
    color: Colors.secondaryText,
    fontSize: 15,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
  },
  footer: {
    marginBottom: 32,
    gap: 24,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: Colors.electricBlue,
  },
  inactiveDot: {
    width: 8,
    backgroundColor: '#E2E8F0',
  },
  primaryButton: {
    backgroundColor: Colors.electricBlue,
    height: 56,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});
