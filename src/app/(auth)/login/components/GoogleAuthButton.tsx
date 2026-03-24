"use client";
import React, { useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { studentAuthService } from '@/services/student/auth.service';
import { Button } from '../../shared/components/Button';
import { useLocalStorage } from '../../shared/hooks/useLocalStorage';

export function GoogleAuthButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [, setOnboardingUser] = useLocalStorage('onboardingUser', null);

  const processPostLogin = (u: any) => {
    if ( !u.leetcode_id || !u.gfg_id || !u.username) {
      setOnboardingUser(u);
      router.push('/');
    } else {
      router.push('/');
    }
  };

  const handleGoogleCallback = async (idToken: string) => {
    setLoading(true);
    setError('');
    try {
      const payload = JSON.parse(atob(idToken.split('.')[1]));
      if (!payload.email?.endsWith('@pwioi.com')) {
        setError('Access denied: Please sign in with your @pwioi.com email address.');
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
      setError(err.response?.data?.error || err.response?.data?.message || 'Google login failed.');
    } finally {
      setLoading(false);
    }
  };

  const initGoogleLogin = () => {
    setError('');
    if (typeof window !== 'undefined' && (window as any).google) {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
      if (!clientId) {
        setError('Google Client ID is missing. Check your environment variables.');
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
        (window as any).google.accounts.id.renderButton(
          btnContainer,
          { theme: "outline", size: "large", text: "continue_with", width: 400 }
        );
      }
    }
  };

  React.useEffect(() => {
    // Attempt initialization if script is already loaded
    if (typeof window !== 'undefined' && (window as any).google) {
      initGoogleLogin();
    }
  }, []);

  return (
    <>
      <Script 
        src="https://accounts.google.com/gsi/client" 
        strategy="afterInteractive" 
        onLoad={initGoogleLogin}
      />
      {error && (
        <div className="mb-5 px-4 py-3 bg-destructive/10 border border-destructive/20 text-destructive text-[13px] font-medium rounded-xl text-center">
          {error}
        </div>
      )}
      <div className="w-full flex justify-center mb-6">
        <div id="googleSignInDiv" className="w-full flex justify-center [&>div]:w-full"></div>
      </div>
    </>
  );
}
