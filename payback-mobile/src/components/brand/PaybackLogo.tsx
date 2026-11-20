import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { Colors } from '../../theme/colors';

interface PaybackLogoProps {
  size?: number;
  showText?: boolean;
  showTagline?: boolean;
  theme?: 'dark' | 'light';
  glow?: boolean;
}

export const PaybackLogo: React.FC<PaybackLogoProps> = ({
  size = 48,
  showText = true,
  showTagline = false,
  theme = 'light',
  glow = false,
}) => {
  const isDark = theme === 'dark';
  const textColor = isDark ? Colors.white : Colors.primaryNavy;
  const taglineColor = isDark ? Colors.secondaryText : Colors.secondaryText;
  const scale = size / 48;

  return (
    <View style={styles.container}>
      <View style={[styles.iconWrapper, glow && styles.glowEffect]}>
        <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          <Defs>
            <LinearGradient id="paybackBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#18B8FF" />
              <Stop offset="100%" stopColor="#0878F9" />
            </LinearGradient>
            <LinearGradient id="paybackDarkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#0060DF" />
              <Stop offset="100%" stopColor="#0040A8" />
            </LinearGradient>
          </Defs>

          {/* Left upright angled ribbon stem */}
          <Path
            d="M10 38V12C10 9.79086 11.7909 8 14 8H26C31.5228 8 36 12.4772 36 18C36 23.5228 31.5228 28 26 28H18V38C18 39.1046 17.1046 40 16 40H12C10.8954 40 10 39.1046 10 38Z"
            fill="url(#paybackBlueGrad)"
          />
          {/* Inner negative space cut of P */}
          <Path
            d="M18 15H25C26.6569 15 28 16.3431 28 18C28 19.6569 26.6569 21 25 21H18V15Z"
            fill={isDark ? '#061735' : '#FFFFFF'}
          />
          {/* Lower accent sweep ribbon (adds dynamic modern fintech depth) */}
          <Path
            d="M16 28L28 28C32.4183 28 36 31.5817 36 36C36 37.1046 35.1046 38 34 38H18C16.8954 38 16 37.1046 16 36V28Z"
            fill="url(#paybackBlueGrad)"
            opacity={0.88}
          />
        </Svg>
      </View>

      {showText && (
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: textColor, fontSize: 24 * Math.max(0.8, scale) }]}>
            PAYBACK
          </Text>
          {showTagline && (
            <Text style={[styles.tagline, { color: taglineColor, fontSize: 12 * Math.max(0.8, scale) }]}>
              Banking Built Around You.
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowEffect: {
    shadowColor: Colors.brightBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 16,
    elevation: 10,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  title: {
    fontWeight: '800',
    letterSpacing: 2,
  },
  tagline: {
    fontWeight: '500',
    marginTop: 2,
    letterSpacing: 0.5,
  },
});
