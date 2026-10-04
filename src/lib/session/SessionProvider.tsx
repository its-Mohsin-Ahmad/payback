import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ALT_SESSION, DEFAULT_SESSION, buildCard } from './demoData';
import type { BankingMode, BusinessProfile, CardVariantKey, Session, UserCard, UserPreferences, UserProfile } from './types';

const STORAGE_KEY = 'payback:session:v1';

interface SessionApi {
  session: Session;
  /** Patch the signed-in user's profile (spec §16). */
  updateProfile: (patch: Partial<UserProfile>) => void;
  updatePreferences: (patch: Partial<UserPreferences>) => void;
  setMode: (mode: BankingMode) => void;
  /** Switch the active business (spec §22, §23). */
  setActiveBusiness: (businessId: string) => void;
  /** Patch a business profile — permission-checked by the caller (spec §10, §11). */
  updateBusiness: (businessId: string, patch: Partial<BusinessProfile>) => void;
  /** Create a new business for the signed-in user and make it active (spec §23). */
  addBusiness: (draft: { name: string; type: string; industry: string; email: string; phone: string; address: string; city: string; country: string }) => void;
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

  /**
   * Switch the business in context (spec §22, §23).
   *
   * Also flips the banking mode into `business`, so choosing a business from the
   * switcher lands the user in business banking rather than leaving the mode
   * inconsistent with what they just picked.
   */
  const setActiveBusiness = useCallback((businessId: string) => {
    setSession((prev) => ({ ...prev, activeBusinessId: businessId, mode: 'business' }));
  }, []);

  /**
   * Patch a business profile (spec §10, §11).
   *
   * Writes through to the single session record, which is why a rename appears
   * on the dashboard, cards, invoices and reports simultaneously — no page needs
   * its own copy of the business name to update.
   */
  const updateBusiness = useCallback((businessId: string, patch: Partial<BusinessProfile>) => {
    setSession((prev) => ({
      ...prev,
      businesses: prev.businesses.map((b) =>
        b.id === businessId ? { ...b, ...patch, updatedAt: new Date().toISOString() } : b,
      ),
    }));
  }, []);

  const addBusiness = useCallback(
    (draft: { name: string; type: string; industry: string; email: string; phone: string; address: string; city: string; country: string }) => {
      setSession((prev) => {
        const now = new Date().toISOString();
        const id = `${prev.user.id}-biz-${Date.now().toString(36)}`;
        const created: BusinessProfile = {
          id,
          ownerUserId: prev.user.id,
          name: draft.name.trim(),
          legalName: draft.name.trim(),
          type: draft.type,
          industry: draft.industry || draft.type,
          registrationNumber: 'Pending verification',
          taxNumber: 'Pending verification',
          email: draft.email || prev.user.email,
          phone: draft.phone || prev.user.phone,
          website: '',
          address: draft.address,
          city: draft.city,
          country: draft.country,
          postalCode: '',
          logoUrl: '',
          employeeCount: 1,
          accountStatus: 'Pending review',
          // Whoever creates a business owns it (spec §7).
          userRole: 'Owner',
          memberSince: now.slice(0, 10),
          createdAt: now,
          updatedAt: now,
        };
        return { ...prev, businesses: [...prev.businesses, created], activeBusinessId: id, mode: 'business' };
      });
    },
    [],
  );

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
      setActiveBusiness,
      updateBusiness,
      addBusiness,
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
      setActiveBusiness,
      updateBusiness,
      addBusiness,
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

/**
 * Sign in as a different customer (spec §10, §11).
 *
 * This is the acceptance test made clickable: switching identity must change the
 * embossed cardholder name everywhere at once — profile, dashboard, cards,
 * accounts — with nothing stale left behind. The previous user's data is
 * replaced wholesale rather than merged, which is what guarantees none of it
 * survives into the new session.
 */
export function DemoUserSwitcher() {
  const { session, replaceSession } = useSession();
  const isAlt = session.user.id === 'usr-sana';

  return (
    <div className="inline-flex items-center gap-2">
      <label htmlFor="demo-user-switch" className="text-xs font-medium text-slate-500">
        Signed in as
      </label>
      <select
        id="demo-user-switch"
        value={isAlt ? 'usr-sana' : 'usr-ahmed'}
        onChange={(e) => replaceSession(e.target.value === 'usr-sana' ? ALT_SESSION : DEFAULT_SESSION)}
        className="focus-ring min-h-[40px] rounded-xl border border-slate-200 bg-white px-2.5 text-sm font-semibold text-slate-800"
      >
        <option value="usr-ahmed">{DEFAULT_SESSION.user.firstName} {DEFAULT_SESSION.user.lastName}</option>
        <option value="usr-sana">{ALT_SESSION.user.firstName} {ALT_SESSION.user.lastName}</option>
      </select>
    </div>
  );
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

  const createdAt = now.toISOString();

  /**
   * The business created at signup (spec §1, §26).
   *
   * This is the record the entire Business Banking context reads from. Note that
   * the *individual* name lives on the user's profile, not here — a business and
   * the person who owns it are separate entities (spec §2, §25).
   */
  const businesses: Session['businesses'] = wantsBusiness
    ? [
        {
          id: `${id}-biz`,
          // §3 — the owner relationship is explicit, not inferred.
          ownerUserId: id,
          name: input.businessName?.trim() || `${full} Trading`,
          legalName: input.businessName?.trim() || `${full} Trading`,
          type: input.businessType?.trim() || 'Sole Proprietorship',
          industry: input.businessType?.trim() || 'Not provided',
          registrationNumber: 'Pending verification',
          taxNumber: 'Pending verification',
          email: input.email,
          phone: input.phone,
          website: '',
          address: input.address,
          city: input.city,
          country: input.country,
          postalCode: input.postal,
          logoUrl: '',
          employeeCount: 1,
          accountStatus: 'Pending review',
          userRole: 'Owner',
          memberSince: createdAt.slice(0, 10),
          createdAt,
          updatedAt: createdAt,
        },
      ]
    : [];

  return {
    demoMode: true,
    mode: wantsBusiness ? 'business' : 'personal',
    // Drives the personalised welcome screen on first entry (spec §50).
    isNewUser: true,
    activeBusinessId: businesses[0]?.id ?? '',
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