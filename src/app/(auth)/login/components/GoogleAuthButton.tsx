"use client";
import React, { useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { studentAuthService } from '@/services/student/auth.service';
import { useLocalStorage } from '../../shared/hooks/useLocalStorage';
import { AlertCircle, AlertTriangle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { BruteForceLoader } from '@/components/ui/BruteForceLoader';

export function GoogleAuthButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [, setOnboardingUser] = useLocalStorage('onboardingUser', null);

  const processPostLogin = (u: any) => {
    if (!u.leetcode_id || !u.gfg_id || !u.username) {
      localStorage.setItem('onboardingUser', JSON.stringify(u));
      router.push('/onboarding');
      return;
    }
    router.push('/');
  };

  const handleGoogleCallback = async (idToken: string) => {
    setLoading(true);
    setError('');

    try {
      const payload = JSON.parse(atob(idToken.split('.')[1]));

      if (!payload.email?.endsWith('@pwioi.com')) {
        setError('Please use your PW student email to log in.');
        setLoading(false);
        return;
      }

      const data = await studentAuthService.googleLogin(idToken);

      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        document.cookie = `accessToken=${data.accessToken}; path=/`;
        processPostLogin(data.user);
      } else {
        setError('Login failed: No token received.');
      }
    } catch (err: any) {

      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Google login failed.'
      );
    } finally {
      setLoading(false);
    }
  };

  const initGoogleLogin = () => {
    setError('');

    if (typeof window !== 'undefined' && (window as any).google) {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

      if (!clientId) {
        setError('Google Client ID missing.');
        return;
      }

      (window as any).google.accounts.id.initialize({
        client_id: clientId,
        callback: (res: any) => {
          if (res.credential) handleGoogleCallback(res.credential);
        },
      });

      const btnContainer = document.getElementById("googleSignInDiv");

      if (btnContainer) {
        // Check if dark mode is enabled

        (window as any).google.accounts.id.renderButton(
          btnContainer,
          {
            theme: "outline",
            size: "large",
            text: "continue_with",
            width: 350,
          }
        );
      }
    }
  };

  React.useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).google) {
      initGoogleLogin();
    }
  }, []);

  return (
    <div >
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={initGoogleLogin}
      />

      

      {/* BUTTON CONTAINER */}
      <div className="w-full  flex flex-col items-center gap-3 mb-3 ">

        {/* GOOGLE BUTTON */}
        <div
          id="googleSignInDiv"
          className="w-full flex justify-center [&>div]:w-full transition-all"
        />

        {/* LOADING STATE */}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse">
            <BruteForceLoader size="sm" />
            Authenticating...
          </div>
        )}
      </div>
       <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center  mb-3  gap-3 px-4 py-3 rounded-2xl bg-red-500/5 border border-red-500/20 shadow-sm"
          >
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <p className="text-xs text-red-400 font-medium leading-tight">{error}</p>
          </motion.div>
        )}
      </AnimatePresence> 
    </div>
  );
}
