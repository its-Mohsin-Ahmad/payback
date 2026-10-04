import { PROFILE_EDIT_ROLES, type BusinessProfile, type Session, type UserAccount, type UserProfile } from './types';

/**
 * Derived display values.
 *
 * These are functions rather than stored fields on purpose: the greeting changes
 * with the clock, the initials change with the name, and the phone mask changes
 * with context. Storing any of them would let the UI go stale (spec §6, §8).
 */

/** "Ahmed" — used in greetings and headings. Falls back to the first name. */
export function displayName(user: UserProfile) {
  return user.preferredName?.trim() || user.firstName?.trim() || user.lastName?.trim() || 'there';
}

/** "Ahmed Khan" — used wherever the full legal name is wanted. */
export function fullName(user: UserProfile) {
  return [user.firstName, user.middleName, user.lastName].filter(Boolean).join(' ').trim();
}

/** Uppercased full name, exactly as it is embossed on a card (spec §10). */
export function cardholderName(user: UserProfile) {
  return fullName(user).toUpperCase();
}

/**
 * Initials for the fallback avatar (spec §5). Derived from the *current* name so
 * a user who edits their name never keeps a stale "AK".
 */
export function initials(user: UserProfile) {
  const first = user.firstName?.trim()?.[0] ?? '';
  const last = user.lastName?.trim()?.[0] ?? user.middleName?.trim()?.[0] ?? '';
  const value = (first + last).toUpperCase();
  return value || 'PB';
}

/** Time-of-day greeting (spec §6). */
export function greeting(date = new Date()) {
  const h = date.getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Masked phone, e.g. `+92 300 ••• ••• 876` (spec §8).
 *
 * Keeps the country and operator prefix and the final three digits, which is
 * enough for a customer to recognise their own number without exposing it.
 */
export function maskPhone(phone: string) {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 6) return phone;
  const tail = digits.slice(-3);
  const head = phone.trim().split(/\s+/).slice(0, 2).join(' ');
  return `${head} ••• ••• ${tail}`;
}

/** One-line address assembled from the profile parts (spec §9). */
export function fullAddress(user: UserProfile) {
  return [user.address, user.city, user.postal, user.country].filter(Boolean).join(', ');
}

/** Compact IBAN for display: keeps the country code and last group. */
export function maskIban(iban: string) {
  const groups = iban.split(' ');
  if (groups.length < 3) return iban;
  return `${groups[0]} •••• •••• •••• ${groups[groups.length - 1]}`;
}

/** Accounts belonging to the user in the active banking context (spec §18, §35). */
export function accountsFor(session: Session) {
  return session.accounts.filter((a) => a.mode === session.mode);
}

/** Cards belonging to the visible accounts only — never mixed across contexts. */
export function cardsFor(session: Session) {
  const ids = new Set(accountsFor(session).map((a) => a.id));
  return session.cards.filter((c) => ids.has(c.accountId));
}

/** Notifications for the active context, newest first (spec §41). */
export function notificationsFor(session: Session) {
  return session.notifications
    .filter((n) => n.userId === session.user.id && n.mode === session.mode)
    .sort((a, b) => b.at.localeCompare(a.at));
}

/**
 * Adapt a session account to the shape the existing account cards render.
 *
 * Kept as an adapter rather than a rewrite so the account cards, account detail
 * page and their charts keep working while the data now comes from the signed-in
 * user (spec §18).
 */
export function toDisplayAccount(account: UserAccount) {
  return {
    id: account.id,
    name: account.name,
    type: account.type,
    number: account.number,
    balance: account.balance,
    available: account.available,
    currency: account.currency,
    changePct: 0,
    status: account.status === 'Active' ? ('Active' as const) : ('Frozen' as const),
    isDefault: account.isDefault,
    interest: account.interest,
    icon: (account.mode === 'business' ? 'briefcase' : 'wallet') as 'wallet',
  };
}

/** Total balance across the visible accounts. */
export function totalBalance(session: Session) {
  return accountsFor(session).reduce((sum, a) => sum + a.balance, 0);
}

/** True when the user holds at least one business profile (spec §21, §52). */
export function hasBusiness(session: Session) {
  return session.businesses.some((b) => b.ownerUserId === session.user.id);
}

/** Business profiles owned by the signed-in user (spec §28). */
export function businessesFor(session: Session) {
  return session.businesses.filter((b) => b.ownerUserId === session.user.id);
}

/**
 * The business currently in context.
 *
 * Falls back to the first owned business so the business shell always has a
 * subject. Every business page reads this rather than a constant (§14, §27).
 */
export function activeBusiness(session: Session): BusinessProfile | undefined {
  const owned = businessesFor(session);
  if (!owned.length) return undefined;
  return owned.find((b) => b.id === session.activeBusinessId) ?? owned[0];
}

/** Whether the signed-in user may edit the business profile (spec §24). */
export function canEditBusiness(business: BusinessProfile | undefined): boolean {
  return !!business && PROFILE_EDIT_ROLES.includes(business.userRole);
}

/**
 * Initials for the business logo fallback (spec §5).
 *
 * Derived from the business name and, critically, *not* from the owner's name:
 * "Nova Digital Solutions" must render ND, never AK. Leading filler words are
 * skipped so "The Green Valley Traders" reads GVT rather than TGV.
 */
export function businessInitials(name: string) {
  const words = name
    .replace(/\b(the|and|of|pvt|ltd|limited|inc|llc|co)\b/gi, ' ')
    .split(/[\s,&]+/)
    .map((w) => w.replace(/[^A-Za-z0-9]/g, ''))
    .filter(Boolean);
  if (!words.length) return 'PB';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

/** One-line business address assembled from its parts (spec §9). */
export function businessAddress(business: BusinessProfile) {
  return [business.address, business.city, business.postalCode, business.country].filter(Boolean).join(', ');
}

/**
 * Name as it appears on a business card.
 *
 * Uppercased for the embossed face (spec §16), and derived from the live profile
 * so a rename propagates to every card at once (§11).
 */
export function businessCardName(business: BusinessProfile) {
  return business.name.trim().toUpperCase();
}