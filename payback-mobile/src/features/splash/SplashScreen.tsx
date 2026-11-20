import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../../theme/colors';
import { PaybackLogo } from '../../components/brand/PaybackLogo';

interface SplashScreenProps {
  onFinish: () => void;
}

const { width, height } = Dimensions.get('window');

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2400);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#061735', '#040F24', '#020914']}
        style={StyleSheet.absoluteFill}
      />

      {/* Glowing Ambient Light Waves (matching reference image) */}
      <View style={styles.waveOverlay} pointerEvents="none">
        <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <Path
            d={`M-50,${height * 0.4} Q${width * 0.3},${height * 0.25} ${width * 0.7},${height * 0.55} T${width + 50},${height * 0.35}`}
            fill="none"
            stroke="rgba(8, 120, 249, 0.45)"
            strokeWidth="3"
          />
          <Path
            d={`M-50,${height * 0.43} Q${width * 0.4},${height * 0.28} ${width * 0.8},${height * 0.58} T${width + 50},${height * 0.4}`}
            fill="none"
            stroke="rgba(24, 184, 255, 0.3)"
            strokeWidth="2"
          />
          <Path
            d={`M-50,${height * 0.65} Q${width * 0.5},${height * 0.8} ${width + 50},${height * 0.62}`}
            fill="none"
            stroke="rgba(8, 120, 249, 0.2)"
            strokeWidth="4"
          />
        </Svg>
      </View>

      {/* Central Brand Presentation */}
      <View style={styles.content}>
        <PaybackLogo size={76} showText={false} theme="dark" glow />
        
        <View style={styles.textBlock}>
          <Text style={styles.brandTitle}>PAYBACK</Text>
          <Text style={styles.tagline}>Banking Built Around You.</Text>
        </View>
      </View>

      {/* Bottom Loading Progress Pill */}
      <View style={styles.footer}>
        <View style={styles.progressTrack}>
          <LinearGradient
            colors={['#0878F9', '#18B8FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.progressBar}
          />
        </View>
        <Text style={styles.versionText}>v1.0.0 • Production Build</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#061735',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    alignItems: 'center',
    marginTop: 18,
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 4,
  },
  tagline: {
    color: Colors.secondaryText,
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
    letterSpacing: 0.8,
  },
  footer: {
    position: 'absolute',
    bottom: 48,
    alignItems: 'center',
  },
  progressTrack: {
    width: 140,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    width: '100%',
    height: '100%',
  },
  versionText: {
    color: 'rgba(132, 147, 170, 0.6)',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 12,
  },
});
