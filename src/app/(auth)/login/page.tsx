import React from 'react';
import { LoginForm } from "./components/LoginForm"
import { GoogleAuthButton } from './components/GoogleAuthButton';

export default function LoginPage() {
  return (
    <div className=' px-10 py-3 w-full'>
      <div className="text-center  mb-8">
       <h1 className="font-serif italic text-5xl font-bold bg-gradient-to-r from-white via-white to-slate-500 bg-clip-text text-foreground tracking-tighter">
              Brute<span className="text-primary">Force</span>
            </h1>
        <p className="text-[13.5px] text-muted-foreground font-medium">
          Outwork. Outsolve. Outrank.
        </p>
      </div>

      <GoogleAuthButton />

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="glass px-3 text-muted-foreground font-medium tracking-widest rounded-full">Or continue with</span>
        </div>
      </div>

      <LoginForm />
    </div>
  );
}
