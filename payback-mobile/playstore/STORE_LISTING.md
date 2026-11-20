# Google Play Store Listing & Production Publishing Guide

## App Information
- **Application Name**: PAYBACK: Digital Banking
- **Short Description**: Banking Built Around You. Send money, pay bills, and manage virtual cards.
- **Default Language**: English (United States)
- **Target Category**: Finance
- **Content Rating**: Everyone (PEGI 3 / ESRB Everyone)
- **Package ID**: `com.payback.mobile`

---

## Full Store Description (Copy & Paste Ready)

```
Welcome to PAYBACK — Banking Built Around You.

PAYBACK is a next-generation digital financial ecosystem designed to give you complete freedom over your money. Experience instant money transfers, smart virtual debit cards, frictionless utility bill payments, and biometric security — all in one beautifully crafted mobile experience.

KEY FEATURES:

✨ INSTANT MONEY TRANSFERS
Send and receive money seamlessly across banks with zero hidden charges. Real-time settlement ensures your funds arrive instantly.

💳 SMART VIRTUAL & PHYSICAL CARDS
Freeze or unfreeze your card with one tap. View card credentials securely with biometric authorization, adjust daily spending limits, and change your PIN in real-time.

⚡ ONE-TAP BILL PAYMENTS
Pay your electricity, water, gas, internet, and mobile phone bills in seconds. Keep track of due dates and avoid late payment fees.

🔒 BANK-GRADE SECURITY
Protected by hardware-backed biometric authentication (Fingerprint & Face ID), 256-bit encryption, and intelligent fraud monitoring.

📊 FINANCIAL ACTIVITY & SMART RECEIPTS
Track every transaction with detailed receipts, categorized spending insights, and instant transaction notifications.

PAYBACK — Smart Banking. Better Tomorrow.
Download now and take control of your financial future.
```

---

## Google Play Data Safety Declarations

| Data Category | Purpose | Ephemeral / Stored | Encrypted in Transit |
|---|---|---|---|
| **Personal Info (Name, Email)** | Account management & authentication | Stored securely | Yes (HTTPS / TLS 1.3) |
| **Financial Info (Account, Transactions)** | Payment processing & banking history | Stored securely | Yes (TLS 1.3) |
| **App Activity** | Crash prevention & performance monitoring | Ephemeral | Yes |
| **Device Identifiers** | Push notification & fraud prevention | Stored securely | Yes |

*User can request account and data deletion at any time via Profile > Security Settings.*

---

## EAS Production Commands

### 1. Build Installable Testing APK
```bash
cd payback-mobile
npx eas-cli build -p android --profile preview
```

### 2. Build Production Signed Google Play App Bundle (.aab)
```bash
cd payback-mobile
npx eas-cli build -p android --profile production
```
