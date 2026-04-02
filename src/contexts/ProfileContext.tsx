"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { studentAuthService } from '@/services/student/auth.service';
import { isStudentToken } from '@/lib/auth-utils';
import { handleToastError } from "@/utils/toast-system";

interface ProfileData {
  data: {
    id: string;
    name: string;
    username: string;
    email: string;
    profileImageUrl?: string;
    leetcode?: string;
    leetcode_id?: string;
    gfg?: string;
    gfg_id?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

interface ProfileContextType {
  profile: ProfileData | null;
  profileLoading: boolean;
  profileError: string | null;
  refetchProfile: () => Promise<void>;
  clearProfile: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const fetchProfile = async () => {
    // Check if we have a student token before making API calls
    if (!isStudentToken()) {
      setProfileLoading(false);
      setProfile(null);
      return;
    }

    setProfileLoading(true);
    setProfileError(null);
    
    try {
      const data = await studentAuthService.getCurrentStudent();
      setProfile(data);
    } catch (e: any) {
      handleToastError(e);
      setProfileError(e?.message || 'Failed to fetch profile');
      
      // Handle different error types gracefully
      if (e?.response?.status === 401) {
        // Token expired - will be handled by interceptors
        setProfile(null);
        return;
      } else if (e?.response?.status === 403) {
        // Admin token on student route
        setProfile(null);
      } else if (e?.code === 'NETWORK_ERROR') {
        // Network connectivity issues
        setProfile(null);
      } else {
        // Other errors
        setProfile(null);
      }
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();

    // Listen for custom event to refetch when onboarding completes
    const handleProfileUpdate = () => {
      fetchProfile();
    };
    
    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []); // Remove pathname dependency - only fetch once on mount

  const refetchProfile = async () => {
    await fetchProfile();
  };

  const clearProfile = () => {
    setProfile(null);
    setProfileError(null);
  };

  return (
    <ProfileContext.Provider value={{ 
      profile, 
      profileLoading, 
      profileError, 
      refetchProfile, 
      clearProfile 
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
