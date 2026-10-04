import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ALT_SESSION, DEFAULT_SESSION, buildCard } from './demoData';
import type { BankingMode, CardVariantKey, Session, UserCard, UserPreferences, UserProfile } from './types';

const STORAGE_KEY = 'payback:session:v1';

interface SessionApi {
  session: Session;
  /** Patch the signed-in user's profile (spec §16). */
  updateProfile: (patch: Partial<UserProfile>) => void;
  updatePreferences: (patch: Partial<UserPreferences>) => void;
  setMode: (mode: BankingMode) => void;
  /** Change one card's settings and persist immediately (spec §14, §15). */
  updateCard: (cardId: string, patch: Partial<UserCard>) => void;
  /** Choose the card design; persists for this user (spec §13). */
  selectCardVariant: (cardId: string, variant: CardVariantKey) => void;
  markNotificationsRead: () => void;
  /** Replace the whole session — used by signup and by switching demo users (§47). */
  replaceSession: (next: Session) => void;
  resetSession: () => void;
}

const SessionContext = createContext<SessionApi | null>(null);

/**
 * Read persisted state, falling back to the demo session.
 *
 * Any parse failure (corrupt entry, older shape) resets rather than throwing —
 * a broken cache should never white-screen the whole banking app.
 */
function loadSession(): Session {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SESSION;
    const parsed = JSON.parse(raw) as Session;
    if (!parsed?.user?.id) return DEFAULT_SESSION;
    return parsed;
  } catch {
    return DEFAULT_SESSION;
  }
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>(loadSession);

  // Persist on every change so a card toggle survives navigating away and back
  // (spec §15) and a reload (spec §16).
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch {
      /* Private browsing or a full quota — the app still works, it just forgets. */
    }
  }, [session]);

  const updateProfile = useCallback((patch: Partial<UserProfile>) => {
    setSession((prev) => ({ ...prev, user: { ...prev.user, ...patch } }));
  }, []);

  const updatePreferences = useCallback((patch: Partial<UserPreferences>) => {
    setSession((prev) => ({ ...prev, preferences: { ...prev.preferences, ...patch } }));
  }, []);

  const setMode = useCallback((mode: BankingMode) => {
    setSession((prev) => ({ ...prev, mode }));
  }, []);

  const updateCard = useCallback((cardId: string, patch: Partial<UserCard>) => {
    setSession((prev) => ({
      ...prev,
      cards: prev.cards.map((c) => (c.id === cardId ? { ...c, ...patch } : c)),
    }));
  }, []);

  /**
   * Switching variant is what reprints the card. The holder name is re-derived
   * from the profile at the same moment, so choosing Gold for "Ahmed Khan" can
   * never leave the previous holder name embossed on it (spec §10).
   */
  const selectCardVariant = useCallback((cardId: string, variant: CardVariantKey) => {
    setSession((prev) => ({
      ...prev,
      cards: prev.cards.map((c) => (c.id === cardId ? { ...c, variant } : c)),
    }));
  }, []);

  const markNotificationsRead = useCallback(() => {
    setSession((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.userId === prev.user.id && n.mode === prev.mode ? { ...n, read: true } : n,
      ),
    }));
  }, []);

  const replaceSession = useCallback((next: Session) => setSession(next), []);

  const resetSession = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setSession(DEFAULT_SESSION);
  }, []);

  const value = useMemo<SessionApi>(
    () => ({
      session,
      updateProfile,
      updatePreferences,
      setMode,
      updateCard,
      selectCardVariant,
      markNotificationsRead,
      replaceSession,
      resetSession,
    }),
    [
      session,
      updateProfile,
      updatePreferences,
      setMode,
      updateCard,
      selectCardVariant,
      markNotificationsRead,
      replaceSession,
      resetSession,
    ],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

/** Access the session. Throws if used outside the provider — a wiring bug, not a user error. */
export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used inside <SessionProvider>');
  return ctx;
}

/** The signed-in user's profile alone — the common case. */
export function useUser() {
  return useSession().session.user;
}

/** Switch between the two bundled demo identities (spec §47). */
export function useDemoUserSwitch() {
  const { session, replaceSession } = useSession();
  return {
    isAlt: session.user.id === 'usr-sana',
    toggle: () => replaceSession(session.user.id === 'usr-sana' ? DEFAULT_SESSION : ALT_SESSION),
  };
}

export function sessionFromSignup(input: {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  address: string;
  city: string;
  country: string;
  postal: string;
  nationalId: string;
  accountType: 'personal' | 'premium' | 'business';
  variant: CardVariantKey;
  twoFactor: UserPreferences['twoFactor'];
  biometrics: boolean;
  businessName?: string;
  businessType?: string;
}): Session {
  const id = `usr-${Date.now().toString(36)}`;
  const full = [input.firstName, input.middleName, input.lastName].filter(Boolean).join(' ').trim();
  const wantsBusiness = input.accountType === 'business';
  const now = new Date();
  const openedAt = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const last4 = String(1000 + (now.getTime() % 9000));
  const personalAccountId = `${id}-current`;
  const businessAccountId = `${id}-business`;

  const user: UserProfile = {
    id,
    firstName: input.firstName,
    middleName: input.middleName,
    lastName: input.lastName,
    preferredName: input.firstName,
    email: input.email,
    phone: input.phone,
    dateOfBirth: input.dateOfBirth,
    nationality: input.nationality,
    address: input.address,
    city: input.city,
    country: input.country,
    postal: input.postal,
    nationalId: input.nationalId || 'Not provided',
    photoUrl: '',
    tier: input.accountType === 'premium' ? 'Premium Customer' : 'Classic Customer',
    memberSince: openedAt,
    createdAt: now.toISOString(),
  };

  const accounts: Session['accounts'] = [
    {
      id: personalAccountId,
      userId: id,
      name: 'Current Account',
      type: input.accountType === 'premium' ? 'Personal Current — Premier' : 'Personal Current',
      number: last4,
      iban: `PK36 SCBL 0000 0011 ${last4} 6702`,
      balance: 0,
      available: 0,
      currency: 'PKR',
      status: 'Active',
      mode: 'personal',
      isDefault: true,
      openedAt,
      interest: 'No profit accrual',
    },
  ];

  if (wantsBusiness) {
    accounts.push({
      id: businessAccountId,
      userId: id,
      name: 'Business Current',
      type: 'Business Current',
      number: String((Number(last4) + 1) % 10000).padStart(4, '0'),
      iban: `PK36 SCBL 0000 0011 ${last4} 6728`,
      balance: 0,
      available: 0,
      currency: 'PKR',
      status: 'Active',
      mode: 'business',
      isDefault: false,
      openedAt,
      interest: 'No profit accrual',
    });
  }

  const cards: UserCard[] = [
    buildCard(id, {
      id: `${id}-card`,
      accountId: personalAccountId,
      accountLabel: `Current Account •••• ${last4}`,
      variant: input.variant,
      // The name captured at signup is what gets embossed (spec §10, §11).
      cardholderName: full.toUpperCase(),
      last4,
    }),
  ];

  const businesses: Session['businesses'] = wantsBusiness
    ? [
        {
          id: `${id}-biz`,
          userId: id,
          name: input.businessName?.trim() || `${full} Trading`,
          type: input.businessType?.trim() || 'Sole Proprietorship',
          registrationNumber: 'Pending verification',
          industry: 'Not provided',
          address: [input.address, input.city, input.country].filter(Boolean).join(', '),
          phone: input.phone,
          email: input.email,
          website: '',
          employees: 1,
          userRole: 'Owner',
          taxId: 'Pending verification',
        },
      ]
    : [];

  return {
    demoMode: true,
    mode: wantsBusiness ? 'business' : 'personal',
    // Drives the personalised welcome screen on first entry (spec §50).
    isNewUser: true,
    user,
    preferences: {
      language: 'English',
      theme: 'system',
      notifications: { email: true, sms: true, push: true },
      marketing: false,
      twoFactor: input.twoFactor,
      biometrics: input.biometrics,
      displayCurrency: 'PKR',
    },
    accounts,
    cards,
    businesses,
    notifications: [
      {
        id: `${id}-welcome`,
        userId: id,
        title: 'Welcome to PAYBACK',
        body: `Your ${accounts[0].type} is ready and your card is on its way.`,
        tone: 'success',
        at: now.toISOString(),
        read: false,
        mode: accounts[0].mode,
      },
    ],
  };
}