import { useState, useEffect, useCallback } from 'react';
import { UserProfile } from '@/types';
import { apiService } from '@/services/api';

export const useAuth = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const profile = await apiService.getUserProfile();
      setUserProfile(profile);
      setIsLoggedIn(!!profile);
    } catch {
      setUserProfile(null);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { userProfile, isLoggedIn, loading, refreshAuth: fetchProfile };
};