import { useState, useEffect } from 'react';
import { UserProfile } from '@/types';
import { apiService } from '@/services/api';

export const useAuth = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
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
    };

    fetchProfile();
  }, []);

  return { userProfile, isLoggedIn, loading };
};