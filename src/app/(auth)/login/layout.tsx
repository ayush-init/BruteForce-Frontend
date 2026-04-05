import React from 'react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import LoginAnimation from './components/LoginAnimation';

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Left side - Animation */}
      <div className="hidden lg:flex lg:w-1/2 min-h-fit min-w-fit items-center justify-center ps-14">
        <LoginAnimation />
      </div>

      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>
      {/* Right side - Login Form */}
      <div className="w-full ms-10  border-s-3 border-border min-h-screen lg:w-1/2 flex items-center justify-end relative ">

        {/* Background Orbs */}
        <div className="absolute top-[-10%] left-[-28%] w-[500px] h-[500px] rounded-full bg-primary/7 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-amber-600/5 dark:bg-amber-900/10 blur-3xl pointer-events-none" />

        {/* Card */}
        <div className="w-full max-w-md  h-full ">
          <div className="w-full -ms-30 glass/70 backdrop-blur-xl shadow-2xl shadow-black/30 flex flex-col justify-center items-end
 animate-in fade-in zoom-in-95 duration-500">
            {children}
          </div>
        </div>

      </div>
    </div>
  );
}
