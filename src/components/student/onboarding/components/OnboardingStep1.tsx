"use client";
import React from 'react';
import { Input } from '../../../../app/(auth)/shared/components/Input';
import { Button } from '../../../../app/(auth)/shared/components/Button';

export function OnboardingStep1({ data, setData, setStep }: { data: any, setData: any, setStep: any }) {
  return (
    <>
      {/* HEADER */}
      <div className="text-center mb-8 space-y-2">
        <h1 className="font-serif italic text-3xl font-bold bg-gradient-to-br from-primary to-amber-600 bg-clip-text text-transparent">
          Set Username
        </h1>

        <p className="text-xs text-muted-foreground font-medium">
          Choose or verify your unique username to continue.
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={e => {
          e.preventDefault();
          if (data.username) setStep(2);
        }}
        className="space-y-6"
      >
        {/* INPUT */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground tracking-wide">
            Username <span className="text-red-500">*</span>
          </label>

          <Input
            type="text"
            placeholder="e.g. jdoe_bruteforce"
            value={data.username}
            onChange={e => setData({ ...data, username: e.target.value })}
            required
            className="h-11 rounded-lg bg-muted/40 focus-visible:ring-2 focus-visible:ring-primary/50 transition-all"
          />

          {/* helper text */}
          <p className="text-[11px] text-muted-foreground">
            This will be your public identity across the platform.
          </p>
        </div>

        {/* CTA BUTTON */}
        <Button
          type="submit"
          disabled={!data.username}
          className="w-full h-11 font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          Next →
        </Button>
      </form>
    </>
  );
}