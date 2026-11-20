# PAYBACK — World-Class Native Fintech Mobile Application

**Tagline:** Banking Built Around You.  
**Package ID:** `com.payback.mobile`  
**Platform:** Android (Google Play Store Release) with iOS-ready architecture.  
**Tech Stack:** React Native, Expo (SDK 58), TypeScript, React Native SVG, Zustand, TanStack Query, Expo Linear Gradient, Lucide Icons, Expo Local Authentication.

---

## 📱 Complete 12 Production Screens Implemented

1. **Screen 01: Splash Screen** (`src/features/splash/SplashScreen.tsx`)
   - Deep navy background (`#061735`), glowing cyan/electric blue ribbon 'P' vector logo, ambient light wave graphics, loading progress bar.
2. **Screen 02: Onboarding** (`src/features/onboarding/OnboardingScreen.tsx`)
   - 3D Neoclassical banking temple vector illustration, floating cards, coins, shields, 3 carousel stages, progress dot indicators, "Get Started" call-to-action.
3. **Screen 03: Login** (`src/features/auth/LoginScreen.tsx`)
   - Email/password validation, show/hide password toggle, biometric fingerprint login button, Google/Apple social sign-in buttons, link to registration.
4. **Screen 04: Registration** (`src/features/auth/RegisterScreen.tsx`)
   - Full name, email, password strength meter (Weak/Medium/Strong), password confirmation, Terms & Privacy policy checkbox, live validation.
5. **Screen 05: Home Dashboard** (`src/features/dashboard/DashboardScreen.tsx`)
   - Greeting header with crown & avatar, balance privacy toggle (hide/show PKR 125,750.00), glossy balance wave card, 4 quick actions (Send Money, Pay Bills, Top Up, More), live transaction feed with categorized badges.
6. **Screen 06: Transactions** (`src/features/transactions/TransactionsScreen.tsx`)
   - Filter tabs (All, Income, Expenses), live search bar, expandable transaction card with reference IDs, fee details, and receipt download.
7. **Screen 07: Cards and Account** (`src/features/cards/CardsScreen.tsx`)
   - Interactive 3D PAYBACK Virtual Card with metallic EMV chip, contactless radiation symbol, cardholder name, expiry, VISA badge, toggle freeze/unfreeze, daily spending limit progress tracker.
8. **Screen 08: Bill Payments** (`src/features/payments/BillPaymentsScreen.tsx`)
   - Utility categories (Electricity, Water, Internet, Gas, Phone, More), unpaid bill cards with one-tap payment confirmation and balance deduction.
9. **Screen 09: Money Transfer** (`src/features/transfers/TransferScreen.tsx`)
   - Dynamic transfer wizard with recipient selection, real-time balance validation, fee calculations, confirmation screen, and generated receipt reference.
10. **Screen 10: Profile and Settings** (`src/features/profile/ProfileScreen.tsx`)
    - User avatar with edit badge, tier indicator ("Premium Elite"), settings list (Security, Notifications, About, Help), and safe logout.
11. **Screen 11: Notifications** (`src/features/notifications/NotificationsScreen.tsx`)
    - Notification feed with category filters (All, Transactions, Security), read/unread indicator dots, and one-tap clear all.
12. **Screen 12: Help and Support** (`src/features/support/SupportScreen.tsx`)
    - 24/7 Live Chat, email concierge, toll-free helpline, expandable FAQ accordion, and direct support ticket submission form.

---

## 🚀 Running the App Locally

### 1. Start Development Server
```bash
cd payback-mobile
npm start
```

### 2. Run on Android Device / Emulator
```bash
npm run android
```

---

## 📦 Building for Google Play Store

### 1. Build Installable Testing APK
```bash
npx eas-cli build -p android --profile preview
```

### 2. Build Production Signed Google Play App Bundle (.aab)
```bash
npx eas-cli build -p android --profile production
```
Full Google Play store listing texts, Data Safety declarations, and rating answers are located in `playstore/STORE_LISTING.md`.
