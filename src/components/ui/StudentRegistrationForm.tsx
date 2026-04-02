"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, GraduationCap, Hash, Code, UserPlus } from 'lucide-react';
import { BruteForceLoader } from '@/components/ui/BruteForceLoader';
import { PasswordInputWithValidation } from './PasswordStrengthIndicator';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';

interface StudentRegistrationFormProps {
  onSubmit: (data: StudentRegistrationData) => void;
  loading?: boolean;
}

export interface StudentRegistrationData {
  name: string;
  email: string;
  username: string;
  password: string;
  enrollment_id: string;
  batch_id: number;
  leetcode_id?: string;
  gfg_id?: string;
}

export function StudentRegistrationForm({ onSubmit, loading = false }: StudentRegistrationFormProps) {
  const [formData, setFormData] = useState<StudentRegistrationData>({
    name: '',
    email: '',
    username: '',
    password: '',
    enrollment_id: '',
    batch_id: 0,
    leetcode_id: '',
    gfg_id: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const { validationResult } = usePasswordValidation(formData.password);

  const handleInputChange = (field: keyof StudentRegistrationData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.endsWith('@pwioi.com')) {
      newErrors.email = 'Must use @pwioi.com email';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validationResult.isValid) {
      newErrors.password = validationResult.message;
    }

    if (!formData.enrollment_id.trim()) {
      newErrors.enrollment_id = 'Enrollment ID is required';
    }

    if (!formData.batch_id || formData.batch_id === 0) {
      newErrors.batch_id = 'Batch selection is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  const isSubmitDisabled = loading || !validationResult.isValid || Object.keys(formData).some(key => 
    key !== 'leetcode_id' && key !== 'gfg_id' && !formData[key as keyof StudentRegistrationData]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* NAME FIELD */}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
          Full Name
        </label>
        <div className="relative group">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            disabled={loading}
            className={`w-full h-14 pl-12 pr-4 bg-input border rounded-2xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all ${
              errors.name ? 'border-red-500' : 'border-white/5'
            }`}
          />
        </div>
        {errors.name && <p className="text-red-400 text-xs ml-1">{errors.name}</p>}
      </div>

      {/* EMAIL FIELD */}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
          Email Address
        </label>
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
          <input
            type="email"
            placeholder="student@pwioi.com"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            disabled={loading}
            className={`w-full h-14 pl-12 pr-4 bg-input border rounded-2xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all ${
              errors.email ? 'border-red-500' : 'border-white/5'
            }`}
          />
        </div>
        {errors.email && <p className="text-red-400 text-xs ml-1">{errors.email}</p>}
      </div>

      {/* USERNAME FIELD */}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
          Username
        </label>
        <div className="relative group">
          <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="johndoe123"
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            disabled={loading}
            className={`w-full h-14 pl-12 pr-4 bg-input border rounded-2xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all ${
              errors.username ? 'border-red-500' : 'border-white/5'
            }`}
          />
        </div>
        {errors.username && <p className="text-red-400 text-xs ml-1">{errors.username}</p>}
      </div>

      {/* PASSWORD FIELD WITH VALIDATION */}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
          Password
        </label>
        <PasswordInputWithValidation
          password={formData.password}
          onPasswordChange={(password) => handleInputChange('password', password)}
          disabled={loading}
          showStrengthIndicator={true}
          showChecklist={true}
          className="space-y-3"
          error={errors.password}
        />
      </div>

      {/* ENROLLMENT ID FIELD */}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
          Enrollment ID
        </label>
        <div className="relative group">
          <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="PW2024001"
            value={formData.enrollment_id}
            onChange={(e) => handleInputChange('enrollment_id', e.target.value)}
            disabled={loading}
            className={`w-full h-14 pl-12 pr-4 bg-input border rounded-2xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all ${
              errors.enrollment_id ? 'border-red-500' : 'border-white/5'
            }`}
          />
        </div>
        {errors.enrollment_id && <p className="text-red-400 text-xs ml-1">{errors.enrollment_id}</p>}
      </div>

      {/* BATCH ID FIELD */}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
          Batch
        </label>
        <div className="relative group">
          <select
            value={formData.batch_id}
            onChange={(e) => handleInputChange('batch_id', parseInt(e.target.value))}
            disabled={loading}
            className={`w-full h-14 pl-12 pr-4 bg-input border rounded-2xl text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all appearance-none cursor-pointer ${
              errors.batch_id ? 'border-red-500' : 'border-white/5'
            }`}
          >
            <option value={0} className="bg-slate-800">Select Batch</option>
            <option value={1} className="bg-slate-800">Batch 1 - 2024</option>
            <option value={2} className="bg-slate-800">Batch 2 - 2024</option>
            <option value={3} className="bg-slate-800">Batch 3 - 2024</option>
          </select>
        </div>
        {errors.batch_id && <p className="text-red-400 text-xs ml-1">{errors.batch_id}</p>}
      </div>

      {/* OPTIONAL PLATFORM IDs */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
            LeetCode ID (Optional)
          </label>
          <div className="relative group">
            <Code className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="leetcode123"
              value={formData.leetcode_id}
              onChange={(e) => handleInputChange('leetcode_id', e.target.value)}
              disabled={loading}
              className="w-full h-14 pl-12 pr-4 bg-input border border-white/5 rounded-2xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
            GFG ID (Optional)
          </label>
          <div className="relative group">
            <Code className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="gfg123"
              value={formData.gfg_id}
              onChange={(e) => handleInputChange('gfg_id', e.target.value)}
              disabled={loading}
              className="w-full h-14 pl-12 pr-4 bg-input border border-white/5 rounded-2xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <motion.button
        type="submit"
        disabled={isSubmitDisabled}
        whileHover={{ scale: isSubmitDisabled ? 1 : 1.01 }}
        whileTap={{ scale: isSubmitDisabled ? 1 : 0.99 }}
        className="w-full h-14 bg-primary hover:bg-primary/90 text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all shadow-[0_10px_20px_rgba(204,255,0,0.1)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <BruteForceLoader size="sm" />
        ) : (
          <>
            <UserPlus size={16} />
            Create Account
          </>
        )}
      </motion.button>
    </form>
  );
}
