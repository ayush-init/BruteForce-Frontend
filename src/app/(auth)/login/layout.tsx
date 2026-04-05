import React from 'react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import LoginAnimation from './components/LoginAnimation';

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Background Decorative Orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-[10%] -top-[10%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] h-[500px] w-[500px] rounded-full bg-amber-500/10 blur-[120px]" />
      </div>

      {/* Theme Toggle Positioning */}
      <div className="absolute right-6 top-6 z-50">
        <ThemeToggle />
      </div>

      <main className="relative flex min-h-screen w-full items-stretch">
        {/* Left Section: Illustration (Visible only on lg+) */}
        <div className="hidden flex-1 items-center justify-center p-12 lg:flex">
          <div className="w-full max-w-2xl animate-in fade-in slide-in-from-left-8 duration-700">
            <LoginAnimation />
          </div>
        </div>

        {/* Right Section: Form Container */}
        <div className="flex w-full  items-center justify-center p-6 lg:w-1/2 lg:p-12">
          <div 
            className="
              relative z-10  
              rounded-2xl border border-white/10 bg-white/5 
               backdrop-blur-2xl  py-20  px-13 
              shadow-[0_20px_50px_rgba(0,0,0,0.3)]
              dark:border-border dark:bg-black/20
              animate-in fade-in zoom-in-95 duration-500
            "
          >
            {/* Subtle Inner Glow for Glassmorphism */}
            <div className="absolute inset-0 -z-10 rounded-2xl   pointer-events-none" />
            
            <div className="flex flex-col space-y-6">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}