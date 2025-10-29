"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '@/types';
import { apiService } from '@/services/api';

interface AuthContextType {
  userProfile: UserProfile | null;
  isLoggedIn: boolean;
  loading: boolean;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const profile = await apiService.getUserProfile();
      setUserProfile(profile);
      setIsLoggedIn(!!profile);
    } catch (error) {
      setUserProfile(null);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  const refreshAuth = async () => {
    setLoading(true);
    await fetchProfile();
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ userProfile, isLoggedIn, loading, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}