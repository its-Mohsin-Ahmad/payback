import { create } from 'zustand';
import { UserProfile } from '../types';

interface AuthState {
  isAuthenticated: boolean;
  isOnboarded: boolean;
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setOnboarded: (val: boolean) => void;
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  biometricLogin: () => Promise<{ success: boolean; message?: string }>;
  register: (fullName: string, email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  toggleBiometrics: (enabled: boolean) => void;
}

const DEFAULT_MOHSIN_PROFILE: UserProfile = {
  id: 'usr_mohsin_01',
  fullName: 'Mohsin Ahmad',
  email: 'mohsin@email.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  phoneNumber: '+92 300 1234567',
  accountTier: 'Premium Elite',
  isBiometricEnabled: true,
  memberSince: 'March 2024',
};

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: true, // Default active session as shown in dashboard reference
  isOnboarded: true,
  user: DEFAULT_MOHSIN_PROFILE,
  isLoading: false,
  error: null,
  
  setOnboarded: (val: boolean) => {
    set({ isOnboarded: val });
  },
  
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    // Simulate real auth delay with validation
    await new Promise(r => setTimeout(r, 600));
    
    if (!email || !email.includes('@')) {
      set({ isLoading: false, error: 'Please enter a valid email address.' });
      return { success: false, message: 'Invalid email address.' };
    }
    if (!password || password.length < 6) {
      set({ isLoading: false, error: 'Password must be at least 6 characters.' });
      return { success: false, message: 'Password too short.' };
    }
    
    set({
      isAuthenticated: true,
      isLoading: false,
      user: {
        ...DEFAULT_MOHSIN_PROFILE,
        email,
        fullName: email.split('@')[0].replace('.', ' ').toUpperCase(),
      }
    });
    return { success: true };
  },
  
  biometricLogin: async () => {
    set({ isLoading: true });
    await new Promise(r => setTimeout(r, 400));
    set({
      isAuthenticated: true,
      isLoading: false,
      user: DEFAULT_MOHSIN_PROFILE,
    });
    return { success: true };
  },
  
  register: async (fullName, email, password) => {
    set({ isLoading: true, error: null });
    await new Promise(r => setTimeout(r, 800));
    
    if (!fullName.trim()) {
      set({ isLoading: false, error: 'Full name is required.' });
      return { success: false, message: 'Full name required.' };
    }
    if (!email.includes('@')) {
      set({ isLoading: false, error: 'Valid email is required.' });
      return { success: false, message: 'Invalid email.' };
    }
    if (password.length < 6) {
      set({ isLoading: false, error: 'Password must be at least 6 characters.' });
      return { success: false, message: 'Password must be at least 6 characters.' };
    }
    
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      fullName,
      email,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      phoneNumber: '+92 300 0000000',
      accountTier: 'Standard',
      isBiometricEnabled: false,
      memberSince: 'Just now',
    };
    
    set({
      isAuthenticated: true,
      isLoading: false,
      user: newUser,
    });
    return { success: true };
  },
  
  logout: () => {
    set({ isAuthenticated: false, user: null });
  },
  
  updateProfile: (updated) => {
    const cur = get().user;
    if (cur) {
      set({ user: { ...cur, ...updated } });
    }
  },
  
  toggleBiometrics: (enabled) => {
    const cur = get().user;
    if (cur) {
      set({ user: { ...cur, isBiometricEnabled: enabled } });
    }
  }
}));
