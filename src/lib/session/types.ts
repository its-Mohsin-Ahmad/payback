/**
 * The PAYBACK session data model.
 *
 * This is the single source of truth for "whose banking information am I
 * looking at" (spec §2, §57). Every authenticated surface reads from here rather
 * than from its own constants, which is what stops the profile, the dashboard and
 * the printed card from disagreeing about the same person's name.
 *
 * Nothing here is a credential. There is deliberately no PIN, CVV, OTP or
 * password field — this shape cannot represent one even accidentally (spec §49).
 */

/** Which banking context is active. Personal and business data never mix (§35). */
export type BankingMode = 'personal' | 'business';

/** Card design selected at signup, persisted thereafter (spec §13). */
export type CardVariantKey = 'green' | 'silver' | 'gold';

export type CardStatus = 'Active' | 'Frozen' | 'Blocked' | 'Expired';

export interface UserProfile {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  /** Shown in greetings. Falls back to the first name when empty (§6). */
  preferredName: string;
  email: string;
  /** Stored unmasked; masked only at render time (§8). */
  phone: string;
  dateOfBirth: string;
  nationality: string;
  address: string;
  city: string;
  country: string;
  postal: string;
  nationalId: string;
  /** Data or object URL. Absent means the initials avatar is used (§5). */
  photoUrl: string;
  tier: string;
  memberSince: string;
  createdAt: string;
}

export interface UserPreferences {
  language: string;
  theme: 'light' | 'dark' | 'system';
  notifications: { email: boolean; sms: boolean; push: boolean };
  marketing: boolean;
  twoFactor: 'authenticator' | 'sms' | 'email';
  biometrics: boolean;
  /** Currency shown by default across balances. */
  displayCurrency: string;
}

/**
 * A card belonging to this user (spec §12).
 *
 * `cardholderName` is stored on the card rather than derived at render time
 * because a customer may legitimately print a different name — but it is
 * *seeded* from the profile at creation (spec §10).
 */
export interface UserCard {
  id: string;
  userId: string;
  accountId: string;
  variant: CardVariantKey;
  cardholderName: string;
  maskedPan: string;
  last4: string;
  expiry: string;
  status: CardStatus;
  type: string;
  contactless: boolean;
  online: boolean;
  international: boolean;
  atm: boolean;
  spendingLimit: number;
  dailyLimit: number;
  currency: string;
  issuedAt: string;
  deliveryStatus: string;
  /** Human label, e.g. "Primary Account" — ties the card to its account (§19). */
  accountLabel: string;
}

export interface UserAccount {
  id: string;
  userId: string;
  name: string;
  type: string;
  /** Last four only. The full number is never held in the client (spec §49). */
  number: string;
  iban: string;
  balance: number;
  available: number;
  currency: string;
  status: string;
  mode: BankingMode;
  isDefault: boolean;
  openedAt: string;
  interest: string;
}

/** Roles a user may hold within a business (spec §24). */
export type BusinessRole = 'Owner' | 'Administrator' | 'Finance Manager' | 'Accountant' | 'Employee' | 'Viewer';

/**
 * Roles permitted to edit the business profile.
 *
 * An Employee or Viewer must not be able to rename the company or change its
 * registration details — that is a profile-editing permission, not a cosmetic
 * one (spec §24).
 */
export const PROFILE_EDIT_ROLES: BusinessRole[] = ['Owner', 'Administrator'];

/** A business owned by, or belonging to, the signed-in user (spec §3). */
export interface BusinessProfile {
  /** Unique business id. */
  id: string;
  /** The user who created/owns this business — the relationship in §2, §28. */
  ownerUserId: string;
  name: string;
  legalName: string;
  type: string;
  industry: string;
  registrationNumber: string;
  taxNumber: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  /**
   * Uploaded business logo.
   *
   * Deliberately separate from `UserProfile.photoUrl`: a personal photo must not
   * stand in for a company logo unless the owner explicitly sets it (§25).
   */
  logoUrl: string;
  employeeCount: number;
  accountStatus: 'Active' | 'Pending review' | 'Suspended';
  /** The signed-in user's role within this business (spec §24). */
  userRole: BusinessRole;
  memberSince: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  tone: 'success' | 'warning' | 'info' | 'error';
  at: string;
  read: boolean;
  /** Personal and business notifications are never shown in the same list (§35). */
  mode: BankingMode;
}

/** The complete session. Persisted to localStorage so changes survive a reload (§16). */
export interface Session {
  user: UserProfile;
  preferences: UserPreferences;
  accounts: UserAccount[];
  cards: UserCard[];
  businesses: BusinessProfile[];
  notifications: UserNotification[];
  /** Active banking context (spec §22, §36). */
  mode: BankingMode;
  /** Which of the user's businesses is in context, for multi-business owners (§22, §23). */
  activeBusinessId: string;
  /** Drives the personalised first-run onboarding screen (spec §50). */
  isNewUser: boolean;
  /** True while viewing synthetic data (spec §48). */
  demoMode: boolean;
}