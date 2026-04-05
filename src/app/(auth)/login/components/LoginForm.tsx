"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { studentAuthService } from '@/services/student/auth.service';
import { handleToastError } from "@/utils/toast-system";

import { BruteForceLoader } from '@/components/ui/BruteForceLoader';

export function LoginForm() {
  const router = useRouter();
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [showPassword, setShowPassword] = useState(false);


  const processPostLogin = (u: any) => {
    if (!u.leetcode_id || !u.gfg_id || !u.username) {
      // Store user data for onboarding page
      localStorage.setItem('onboardingUser', JSON.stringify(u));
      // Redirect immediately to onboarding
      router.push('/onboarding');
      return; // Don't go to home page
    }
    router.push('/'); // Only go to home if no onboarding needed
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrUsername || !password) return;

    if (emailOrUsername.includes('@')) {
      if (!emailOrUsername.endsWith('@pwioi.com')) {
        setEmailError("Please sign in with your PW email.");
        return;
      }
    }

    try {
      setLoading(true);
      const isEmail = emailOrUsername.includes('@');
      const payload = isEmail ? { email: emailOrUsername, password } : { username: emailOrUsername, password };

      const data = await studentAuthService.login(payload);
      if (data?.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        document.cookie = `accessToken=${data.accessToken}; path=/; secure; samesite=strict`;
        processPostLogin(data.user);
      }
    } catch (err) {
      handleToastError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      {/* IDENTITY INPUT */}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
          Email ID / Username
        </label>
        <div className="relative ">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-logo transition-colors" />
          <input
            type="text"
            placeholder="admin@bruteforce.com"
            value={emailOrUsername}
            onChange={(e) => { setEmailOrUsername(e.target.value); setEmailError(''); }}
            disabled={loading}
            className="w-full h-12 pl-11 pr-4  border border-border rounded-xl text-sm text-foreground placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-logo/40 transition-all"
          />
        </div>
        <AnimatePresence mode="wait">
          {emailError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center  gap-3 px-4 py-3 rounded-2xl bg-red-500/5 border border-red-500/20 shadow-sm"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <p className="text-xs text-red-400 font-medium leading-tight">{emailError}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* PASSWORD INPUT */}
   <div className="space-y-2">
  
  {/* LABEL + FORGOT PASSWORD IN SAME ROW */}
  <div className="flex items-center justify-between">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 group-focus-within:text-logo transition-colors">
      Password
    </label>

    <button
      type="button"
      className="text-[10px] font-bold text-slate-500 hover:text-[#CCFF00] uppercase tracking-widest transition-colors"
      onClick={() => router.push('/forgot-password')}
    >
      Forgot Password?
    </button>
  </div>

  {/* INPUT */}
  <div className="relative">
    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-logo transition-colors" />
    
    <input
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      disabled={loading}
      placeholder="Enter your password"
      required
      className="w-full h-12 pl-11 pr-4 border border-border rounded-xl text-sm text-foreground placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-logo/40 transition-all"
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
    >
      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
  </div>
</div>

     

      {/* LOG IN BUTTON */}
      <button
        type="submit"
        disabled={loading}
        className="w-full h-14 bg-[#CCFF00] hover:bg-[#D9FF33] text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all shadow-[0_10px_20px_rgba(204,255,0,0.1)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <BruteForceLoader size="sm" />
            <span className="text-sm text-muted-foreground">Logging in...</span>
          </div>
        ) : (
          <>
            <LogIn size={16} />
            Log In
          </>
        )}
      </button>
    </form>
  );
}

