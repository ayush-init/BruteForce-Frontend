'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LoginCredentials } from '@/types/auth.types';

export default function AdminLoginForm() {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  
  const { handleAdminLogin, isLoading, error } = useAuth();
  const [isDark, setIsDark] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleAdminLogin(credentials);
      window.location.href = '/admin';
    } catch (error) {
      // Error already in state
    }
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  return (
    <div className={`font-body min-h-screen flex flex-col ${isDark ? 'dark' : ''}`}>
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 py-6 bg-transparent">
        <div className="text-2xl font-bold tracking-tighter text-yellow-500 dark:text-yellow-400">
          BruteForce
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={toggleTheme}
            className="text-slate-600 dark:text-slate-400 hover:bg-yellow-500/10 dark:hover:bg-yellow-400/10 p-2 rounded-full transition-colors duration-200"
          >
            {isDark ? 'light_mode' : 'dark_mode'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-6 relative">
        <div className="w-full max-w-md relative">
          {/* Central Security Icon */}
          <div className="flex justify-center mb-10">
            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/30 transition-all duration-500 opacity-50"></div>
              <div className="relative bg-primary text-primary-foreground p-4 rounded-full">
                <span className="text-2xl">security</span>
              </div>
            </div>
          </div>

          {/* Main Auth Card */}
          <div className="glass-card premium-shadow rounded-[1.4rem] p-10 border border-outline-variant/15">
            <div className="text-center mb-10">
              <h1 className="font-headline text-3xl font-bold tracking-tight text-on-surface mb-3">
                Admin Access
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="text-error text-sm text-center p-3 bg-error-container/10 rounded-lg">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-on-surface-variant ml-1 tracking-wider uppercase" htmlFor="email">
                  Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    placeholder="admin@bruteforce.sec"
                    value={credentials.email}
                    onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                    className="w-full bg-surface-container-lowest border-0 focus:ring-2 focus:ring-primary/50 focus:ring-offset-4 focus:ring-offset-surface rounded-[1.4rem] py-4 px-6 text-on-surface placeholder-on-surface-variant/30 transition-all duration-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-semibold text-on-surface-variant tracking-wider uppercase" htmlFor="password">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••••••"
                    value={credentials.password}
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                    className="w-full bg-surface-container-lowest border-0 focus:ring-2 focus:ring-primary/50 focus:ring-offset-4 focus:ring-offset-surface rounded-[1.4rem] py-4 px-6 text-on-surface placeholder-on-surface-variant/30 transition-all duration-300"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold py-5 rounded-[1.4rem] transition-all duration-300 hover:scale-[1.02] active:scale-95 inner-glow shadow-xl shadow-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <style jsx>{`
        .glass-card {
          background: rgba(32, 31, 31, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .premium-shadow {
          box-shadow: 0 48px 100px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(154, 144, 123, 0.1);
        }
        .inner-glow {
          box-shadow: inset 0 1px 0 0 rgba(255, 232, 183, 0.2);
        }
        body {
          background-color: #131313;
          background-image: 
            radial-gradient(circle at 0% 0%, rgba(248, 200, 71, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 100% 100%, rgba(248, 200, 71, 0.03) 0%, transparent 50%);
        }
        .dark body {
          background-color: #131313;
        }
        .light body {
          background-color: #ffffff;
        }
      `}</style>
    </div>
  );
}