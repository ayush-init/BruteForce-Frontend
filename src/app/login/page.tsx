"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { studentAuthService } from '@/services/student/auth.service';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Onboarding States
  const [onboardingUser, setOnboardingUser] = useState<any>(null);
  const [onboardingStep, setOnboardingStep] = useState<0 | 1 | 2 | 3>(0);
  const [onboardingData, setOnboardingData] = useState({ username: '', leetcode_id: '', gfg_id: '', linkedin: '', github: '' });
  const [onboardingConfirmChecked, setOnboardingConfirmChecked] = useState(false);

  // Generic Toasts
  const [toasts, setToasts] = useState<{id: number, message: string, type: 'success' | 'error'}[]>([]);
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  // Forgot Password States
  const [forgotPasswordStep, setForgotPasswordStep] = useState<'none' | 'email' | 'otp' | 'new-password'>('none');
  const [fpEmail, setFpEmail] = useState('');
  const [fpOtpArray, setFpOtpArray] = useState<string[]>(Array(6).fill(''));
  const [fpNewPassword, setFpNewPassword] = useState('');
  const [fpConfirmPassword, setFpConfirmPassword] = useState('');
  const [fpError, setFpError] = useState('');
  const [fpSuccess, setFpSuccess] = useState('');

  const processPostLogin = (u: any) => {
    if (!u.id || !u.leetcode_id || !u.gfg_id || !u.username) {
      setOnboardingUser(u);
      setOnboardingData(prev => ({ ...prev, username: u.username || '', leetcode_id: u.leetcode_id || '', gfg_id: u.gfg_id || '' }));
      setOnboardingStep(1); // Always start at Step 1 for confirmation
    } else {
      router.push('/');
    }
  };

  // We no longer extract the token from the URL hash.
  // Instead, the GSI callback will automatically execute this logic.
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrUsername || !password) {
      setError("Please fill all fields.");
      return;
    }
    setLoading(true);
    setError('');

    try {
      const isEmail = emailOrUsername.includes('@');
      const payload = isEmail
        ? { email: emailOrUsername, password }
        : { username: emailOrUsername, password };

      const data = await studentAuthService.login(payload);

      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        document.cookie = `accessToken=${data.accessToken}; path=/`;
        processPostLogin(data.user);
      } else {
        setError('Login failed: No token received.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setError('');
    // Ensure the Google SDK is loaded
    if (typeof window !== 'undefined' && (window as any).google) {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
      if (!clientId) {
        setError('Google Client ID is missing. Check your environment variables.');
        return;
      }

      // Initialize GSI One-Tap / Popup explicitly for this click
      (window as any).google.accounts.id.initialize({
        client_id: clientId,
        callback: (res: any) => {
          if (res.credential) handleGoogleCallback(res.credential);
        },
      });

      // Trigger the official GSI prompt
      (window as any).google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          setError('Google Sign-In popup was blocked by your browser. Please allow popups or use One-Tap.');
        }
      });
    } else {
      setError('Google Auth script is still loading. Please try again in a moment.');
    }
  };

  // Forgot Password API Handlers
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fpEmail) { showToast("Please enter your email.", 'error'); return setFpError("Please enter your email."); }
    setLoading(true); setFpError('');
    try {
      await studentAuthService.forgotPassword(fpEmail);
      setForgotPasswordStep('otp');
      showToast("Email sent successfully ✅");
    } catch (err: any) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Failed to send OTP.';
      setFpError(msg); showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1]; // ensure 1 digit
    const newOtp = [...fpOtpArray];
    newOtp[index] = value;
    setFpOtpArray(newOtp);
    if (value && index < 5) document.getElementById(`otp-input-${index + 1}`)?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !fpOtpArray[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    }
  };

  const handleVerifyOtpLocal = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpJoined = fpOtpArray.join('');
    if (otpJoined.length < 6) { showToast("Invalid OTP ❌", 'error'); return setFpError("Please enter the 6-digit OTP."); }
    setFpError('');
    showToast("OTP sent successfully ✅");
    setForgotPasswordStep('new-password');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fpNewPassword) { showToast("Please enter a new password.", 'error'); return setFpError("Please enter a new password."); }
    if (fpNewPassword !== fpConfirmPassword) { showToast("Passwords do not match.", 'error'); return setFpError("Passwords do not match."); }
    setLoading(true); setFpError('');
    try {
      await studentAuthService.resetPassword({ email: fpEmail, otp: fpOtpArray.join(''), newPassword: fpNewPassword });
      setForgotPasswordStep('none');
      setFpSuccess('Password reset successful. You can now login.');
      showToast("Password reset successful ✅");
      setFpEmail(''); setFpOtpArray(Array(6).fill('')); setFpNewPassword(''); setFpConfirmPassword('');
    } catch (err: any) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Failed to reset password.';
      setFpError(msg); showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const submitOnboarding = async () => {
    if (!onboardingConfirmChecked) { showToast("Please confirm that your usernames are correct.", 'error'); return; }
    setLoading(true);
    try {
      const payload = {
         city_id: onboardingUser?.cityId || onboardingUser?.city?.id,
         batch_id: onboardingUser?.batchId || onboardingUser?.batch?.id,
         leetcode_id: onboardingData.leetcode_id,
         gfg_id: onboardingData.gfg_id,
         linkedin: onboardingData.linkedin,
         github: onboardingData.github,
         username: onboardingData.username
      };
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/students/profile`, {
         method: 'PUT',
         headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` },
         body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to save profile.");
      showToast("Profile completed successfully. Welcome!", "success");
      router.push('/');
    } catch (err) {
      showToast("Profile verification failed.", 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">

      {/* Official GSI Library */}
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />

      {/* Absolute Header for Theme Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-amber-600/5 dark:bg-amber-900/10 blur-3xl pointer-events-none" />

      <div className="bg-card w-full max-w-[440px] p-10 rounded-3xl shadow-xl shadow-black/5 dark:shadow-black/40 border border-border/80 z-10 animate-in fade-in zoom-in-95 duration-500">

        <div className="text-center mb-8">
          <h1 className="font-serif italic text-4xl font-bold bg-gradient-to-br from-primary to-amber-600 bg-clip-text text-transparent mb-2 shrink-0">
            BruteForce
          </h1>
          <p className="text-[13.5px] text-muted-foreground font-medium">
            Outwork. Outsolve. Outrank.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={handleGoogleLogin}
          className="w-full h-11 mb-6 text-[13.5px] font-medium transition-colors hover:bg-primary/5 hover:text-primary hover:border-primary/40"
        >
          <svg className="w-4 h-4 mr-2" viewBox="0 0 18 18">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
            <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
          </svg>
          Continue with Google
        </Button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-3 text-muted-foreground font-medium tracking-widest">Or continue with</span>
          </div>
        </div>

        {fpSuccess && (
          <div className="mb-5 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[13px] font-medium rounded-xl text-center">
            {fpSuccess}
          </div>
        )}

        {error && (
          <div className="mb-5 px-4 py-3 bg-destructive/10 border border-destructive/20 text-destructive text-[13px] font-medium rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold text-foreground tracking-wide">
              Email or Username
            </label>
            <Input
              type="text"
              placeholder="student@example.com or username"
              value={emailOrUsername}
              onChange={e => setEmailOrUsername(e.target.value)}
              disabled={loading}
              className="h-11 bg-muted/40"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[12px] font-semibold text-foreground tracking-wide">
                Password
              </label>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); setForgotPasswordStep('email'); setFpError(''); setFpEmail(''); setFpSuccess(''); }}
                className="text-primary font-medium text-[12px] hover:underline transition-all focus:outline-none"
              >
                Forgot password?
              </button>
            </div>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
              className="h-11 bg-muted/40"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 mt-4 text-[14px] font-semibold tracking-wide bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 text-primary-foreground shadow-md transition-all active:scale-[0.98]"
          >
            {loading ? 'Authenticating...' : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </>
            )}
          </Button>
        </form>
      </div>

      {/* MODALS overlays */}
      {forgotPasswordStep !== 'none' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-[440px] p-10 rounded-3xl shadow-xl shadow-black/5 dark:shadow-black/40 border border-border/80 relative">

            <button
              onClick={() => setForgotPasswordStep('none')}
              className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
            >
              ✕
            </button>

            <div className="text-center mb-8">
              <h1 className="font-serif italic text-3xl font-bold bg-gradient-to-br from-primary to-amber-600 bg-clip-text text-transparent mb-2">
                Reset Password
              </h1>
              <p className="text-[13px] text-muted-foreground font-medium">
                {forgotPasswordStep === 'email' && "Enter your email to receive an OTP."}
                {forgotPasswordStep === 'otp' && "Enter the OTP sent to your email."}
                {forgotPasswordStep === 'new-password' && "Create a new strong password."}
              </p>
            </div>

            {fpError && (
              <div className="mb-5 px-4 py-3 bg-destructive/10 border border-destructive/20 text-destructive text-[13px] font-medium rounded-xl text-center">
                {fpError}
              </div>
            )}

            {forgotPasswordStep === 'email' && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-semibold text-foreground tracking-wide">Email Address</label>
                  <Input
                    type="email"
                    placeholder="student@pwioy.com"
                    value={fpEmail}
                    onChange={e => setFpEmail(e.target.value)}
                    disabled={loading}
                    className="h-11 bg-muted/40"
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full h-11 mt-4 text-[14px] font-semibold tracking-wide bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 text-primary-foreground shadow-md transition-all active:scale-[0.98]">
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </Button>
              </form>
            )}

            {forgotPasswordStep === 'otp' && (
              <form onSubmit={handleVerifyOtpLocal} className="space-y-4">
                <div className="space-y-3">
                  <label className="text-[12px] font-semibold text-foreground tracking-wide text-center block">Enter OTP</label>
                  <div className="flex justify-between gap-2">
                    {fpOtpArray.map((digit, idx) => (
                      <Input 
                        key={idx}
                        id={`otp-input-${idx}`}
                        type="text" 
                        value={digit}
                        onChange={e => handleOtpChange(idx, e.target.value)}
                        onKeyDown={e => handleOtpKeyDown(idx, e)}
                        disabled={loading}
                        className="h-12 w-12 bg-muted/40 text-center text-xl font-mono p-0"
                        maxLength={1}
                        required
                      />
                    ))}
                  </div>
                </div>
                <Button type="submit" disabled={loading} className="w-full h-11 mt-4 text-[14px] font-semibold tracking-wide bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 text-primary-foreground shadow-md transition-all active:scale-[0.98]">
                  Verify OTP
                </Button>
              </form>
            )}

            {forgotPasswordStep === 'new-password' && (
              <form onSubmit={handleResetPassword} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-semibold text-foreground tracking-wide">New Password</label>
                  <Input 
                    type="password" 
                    placeholder="••••••••"
                    value={fpNewPassword}
                    onChange={e => setFpNewPassword(e.target.value)}
                    disabled={loading}
                    className="h-11 bg-muted/40"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-semibold text-foreground tracking-wide">Confirm Password</label>
                  <Input 
                    type="password" 
                    placeholder="••••••••"
                    value={fpConfirmPassword}
                    onChange={e => setFpConfirmPassword(e.target.value)}
                    disabled={loading}
                    className="h-11 bg-muted/40"
                    required
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full h-11 mt-4 text-[14px] font-semibold tracking-wide bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 text-primary-foreground shadow-md transition-all active:scale-[0.98]">
                  {loading ? 'Resetting Password...' : 'Reset Password'}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ONBOARDING FLOW */}
      {onboardingStep > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-card w-full max-w-[480px] p-10 rounded-3xl shadow-2xl shadow-black/10 border border-border/80 relative">
            
            {/* Visual Stepper */}
            <div className="flex items-center justify-center gap-2 mb-8 mt-2">
              <div className="flex flex-col items-center gap-1.5 w-16">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${onboardingStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>1</div>
                <span className={`text-[10px] font-semibold tracking-wider uppercase ${onboardingStep >= 1 ? 'text-foreground' : 'text-muted-foreground'}`}>Username</span>
              </div>
              <div className={`h-[2px] w-10 mt-[-20px] rounded-full transition-colors ${onboardingStep >= 2 ? 'bg-primary' : 'bg-muted/80'}`} />
              <div className="flex flex-col items-center gap-1.5 w-16">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${onboardingStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>2</div>
                <span className={`text-[10px] font-semibold tracking-wider uppercase ${onboardingStep >= 2 ? 'text-foreground' : 'text-muted-foreground'}`}>Profiles</span>
              </div>
              <div className={`h-[2px] w-10 mt-[-20px] rounded-full transition-colors ${onboardingStep === 3 ? 'bg-primary' : 'bg-muted/80'}`} />
              <div className="flex flex-col items-center gap-1.5 w-16">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${onboardingStep === 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>3</div>
                <span className={`text-[10px] font-semibold tracking-wider uppercase ${onboardingStep === 3 ? 'text-foreground' : 'text-muted-foreground'}`}>Confirm</span>
              </div>
            </div>

            <div className="text-center mb-6">
              <h1 className="font-serif italic text-3xl font-bold bg-gradient-to-br from-primary to-amber-600 bg-clip-text text-transparent mb-2">
                {onboardingStep === 1 ? 'Set Username' : onboardingStep === 2 ? 'Coding Profiles' : 'Confirm Validation'}
              </h1>
              <p className="text-[13px] text-muted-foreground font-medium">
                {onboardingStep === 1 && "Choose or verify your unique username to continue."}
                {onboardingStep === 2 && "Connect your coding profiles for automated evaluation tracking."}
                {onboardingStep === 3 && "Verify your endpoints carefully."}
              </p>
            </div>

            {onboardingStep === 1 && (
              <form onSubmit={e => { e.preventDefault(); if(onboardingData.username) setOnboardingStep(2); }} className="space-y-6">
                 <div className="space-y-1.5">
                   <label className="text-[12px] font-semibold text-foreground tracking-wide">Username <span className="text-red-500">*</span></label>
                   <Input 
                     type="text" 
                     placeholder="e.g. jdoe_bruteforce"
                     value={onboardingData.username}
                     onChange={e => setOnboardingData({...onboardingData, username: e.target.value})}
                     className="h-11 bg-muted/40"
                     required
                   />
                 </div>
                 <Button type="submit" disabled={!onboardingData.username} className="w-full h-11 bg-primary text-primary-foreground font-semibold">
                   Next
                 </Button>
              </form>
            )}

            {onboardingStep === 2 && (
              <form onSubmit={e => { e.preventDefault(); if(onboardingData.leetcode_id && onboardingData.gfg_id) setOnboardingStep(3); }} className="space-y-5">
                 <div className="space-y-1.5">
                   <div className="flex justify-between items-center">
                     <label className="text-[12px] font-semibold text-foreground tracking-wide">LeetCode Username</label>
                     <span className="text-[10px] uppercase font-bold text-red-500 tracking-wider">Mandatory</span>
                   </div>
                   <Input type="text" value={onboardingData.leetcode_id} onChange={e => setOnboardingData({...onboardingData, leetcode_id: e.target.value})} className="h-11 bg-muted/40" required placeholder="LeetCode Handle" />
                   <p className="text-[11px] text-muted-foreground italic">These are required for evaluation</p>
                 </div>
                 <div className="space-y-1.5">
                   <div className="flex justify-between items-center">
                     <label className="text-[12px] font-semibold text-foreground tracking-wide">GFG Username</label>
                     <span className="text-[10px] uppercase font-bold text-red-500 tracking-wider">Mandatory</span>
                   </div>
                   <Input type="text" value={onboardingData.gfg_id} onChange={e => setOnboardingData({...onboardingData, gfg_id: e.target.value})} className="h-11 bg-muted/40" required placeholder="GeeksForGeeks Handle" />
                   <p className="text-[11px] text-muted-foreground italic">These are required for evaluation</p>
                 </div>
                 <div className="space-y-1.5 mt-2">
                   <label className="text-[12px] font-semibold text-foreground tracking-wide flex justify-between">LinkedIn URL <span className="text-[10px] uppercase font-bold text-muted-foreground">Optional</span></label>
                   <Input type="url" value={onboardingData.linkedin} onChange={e => setOnboardingData({...onboardingData, linkedin: e.target.value})} className="h-11 bg-muted/40" placeholder="https://linkedin.com/in/..." />
                 </div>
                 <div className="space-y-1.5">
                   <label className="text-[12px] font-semibold text-foreground tracking-wide flex justify-between">Other URL <span className="text-[10px] uppercase font-bold text-muted-foreground">Optional</span></label>
                   <Input type="url" value={onboardingData.github} onChange={e => setOnboardingData({...onboardingData, github: e.target.value})} className="h-11 bg-muted/40" placeholder="https://github.com/..." />
                 </div>
                 <Button type="submit" disabled={!onboardingData.leetcode_id || !onboardingData.gfg_id} className="w-full h-11 bg-primary text-primary-foreground font-semibold mt-4">
                   Submit
                 </Button>
              </form>
            )}

            {onboardingStep === 3 && (
              <div className="space-y-6">
                <div className="bg-destructive/10 border border-destructive/20 text-destructive text-[13px] font-medium p-4 rounded-xl">
                  ⚠️ If your usernames are incorrect, your evaluation will NOT work correctly. Review handles carefully: you cannot manually edit your username or ID tracking fields after completion.
                </div>

                <div className="space-y-4">
                   <div className="p-3 bg-muted rounded-lg border flex justify-between items-center">
                     <div>
                       <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">LeetCode</p>
                       <p className="font-medium text-[14px] truncate max-w-[130px]" title={onboardingData.leetcode_id}>{onboardingData.leetcode_id}</p>
                     </div>
                     <a href={`https://leetcode.com/u/${onboardingData.leetcode_id}/`} target="_blank" rel="noopener noreferrer" className="text-primary hover:bg-primary/5 transition-colors border-primary/20 border text-xs font-semibold px-3 py-1.5 bg-primary/10 rounded-md whitespace-nowrap">
                       🔗 View Profile
                     </a>
                   </div>
                   <div className="p-3 bg-muted rounded-lg border flex justify-between items-center">
                     <div>
                       <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">GeeksForGeeks</p>
                       <p className="font-medium text-[14px] truncate max-w-[130px]" title={onboardingData.gfg_id}>{onboardingData.gfg_id}</p>
                     </div>
                     <a href={`https://auth.geeksforgeeks.org/user/${onboardingData.gfg_id}/`} target="_blank" rel="noopener noreferrer" className="text-primary hover:bg-primary/5 border border-primary/20 transition-colors text-xs font-semibold px-3 py-1.5 bg-primary/10 rounded-md whitespace-nowrap">
                       🔗 View Profile
                     </a>
                   </div>
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <input type="checkbox" id="confirmData" checked={onboardingConfirmChecked} onChange={e => setOnboardingConfirmChecked(e.target.checked)} className="mt-0.5 w-4 h-4 text-primary cursor-pointer border-border rounded" />
                  <label htmlFor="confirmData" className="text-xs text-muted-foreground leading-tight cursor-pointer">
                    I confirm that the above URLs successfully open my actual profiles and the handles entered precisely match my accounts.
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => setOnboardingStep(2)} disabled={loading} className="w-1/3 h-11">
                    Edit
                  </Button>
                  <Button onClick={submitOnboarding} disabled={!onboardingConfirmChecked || loading} className="w-2/3 h-11 bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 text-primary-foreground font-semibold">
                    {loading ? 'Saving securely...' : 'Confirm & Save'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATIONS */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`px-5 py-3 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border text-[13.5px] font-medium animate-in slide-in-from-right-8 fade-in duration-300 pointer-events-auto flex items-center gap-2 ${t.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' : 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800'} `}>
            {t.message}
          </div>
        ))}
      </div>

    </div>
  );
}
