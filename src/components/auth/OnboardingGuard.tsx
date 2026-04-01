"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { studentAuthService } from '@/services/student/auth.service';
import { isStudentToken } from '@/lib/auth-utils';

interface OnboardingGuardProps {
  children: React.ReactNode;
}

export function OnboardingGuard({ children }: OnboardingGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      // Skip check if already on onboarding page
      if (pathname === '/onboarding') {
        setChecking(false);
        return;
      }

      // Check if we have a student token
      if (!isStudentToken()) {
        router.push('/login');
        return;
      }

      try {
        const studentData = await studentAuthService.getCurrentStudent();
        const { username, leetcode, gfg } = studentData?.data || {};
        
        // Check if onboarding is incomplete
        if (!username || !leetcode || !gfg) {
          console.log("OnboardingGuard: User needs onboarding, redirecting");
          router.push('/onboarding');
          return;
        }
        
        setUser(studentData.data);
      } catch (error) {
        console.error("OnboardingGuard: Error checking user status", error);
        // If there's an error fetching user data, redirect to login
        router.push('/login');
      } finally {
        setChecking(false);
      }
    };

    checkOnboarding();
  }, [router, pathname]);

  // Show loading spinner while checking
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-8 h-8 border-2 border-[#CCFF00] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If no user data (shouldn't happen due to redirect logic), return null
  if (!user && pathname !== '/onboarding') {
    return null;
  }

  return <>{children}</>;
}