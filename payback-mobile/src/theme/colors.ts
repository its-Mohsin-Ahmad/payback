export const Colors = {
  // Primary Fintech Brand Tokens
  primaryNavy: '#061735',
  secondaryNavy: '#0B2450',
  electricBlue: '#0878F9',
  brightBlue: '#18B8FF',
  white: '#FFFFFF',
  lightBackground: '#F4F7FC',
  secondaryText: '#8493AA',
  primaryText: '#061735',
  darkText: '#0A192F',
  successGreen: '#16A875',
  errorRed: '#E74C3C',
  warningYellow: '#F59E0B',
  border: '#E2E8F0',
  cardBackground: '#FFFFFF',
  subtleNavy: 'rgba(6, 23, 53, 0.05)',
  surfaceHighlight: 'rgba(24, 184, 255, 0.1)',
  
  // Gradients
  gradients: {
    primary: ['#0878F9', '#18B8FF'] as const,
    balanceCard: ['#0A2552', '#061735'] as const,
    balanceWave: ['#0878F9', '#0B2450'] as const,
    electricGlow: ['rgba(8, 120, 249, 0.4)', 'rgba(24, 184, 255, 0.0)'] as const,
    darkCard: ['#081A3E', '#040F24'] as const,
    goldChip: ['#FFE082', '#FFB300'] as const,
  },
  
  // Shadows
  shadows: {
    soft: {
      shadowColor: '#061735',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
      elevation: 3,
    },
    card: {
      shadowColor: '#0878F9',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 18,
      elevation: 8,
    },
    button: {
      shadowColor: '#0878F9',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 14,
      elevation: 6,
    },
  }
};
