"use client";

import React from 'react';
import { toast, ToasterProps } from 'sonner';
import {
  CheckCircle,
  XCircle,
  Loader2,
  X
} from 'lucide-react';

// Premium SaaS toast configuration
export const toastConfig: ToasterProps = {
  position: 'top-right',
  theme: 'system',
  richColors: false,
  closeButton: false,
  duration: 2000,
  className: 'premium-saas-toast',
  toastOptions: {
    classNames: {
      toast: 'premium-saas-toast',
      icon: 'premium-toast-icon',
      title: 'premium-toast-title',
      description: 'premium-toast-description',
      actionButton: 'premium-toast-action',
      cancelButton: 'premium-toast-cancel',
      closeButton: 'premium-toast-close',
    },
  },
};

// Custom premium toast renderer
const PremiumToastRenderer = ({ toast: toastObj, title, description, icon, id }: any) => {
  const isSuccess = toastObj.type === 'success';
  const isError = toastObj.type === 'error';
  const isLoading = toastObj.type === 'loading';

  const getIcon = () => {
    if (isLoading) return React.createElement(Loader2, { className: "w-5 h-5 animate-spin text-blue-400" });
    if (isSuccess) return React.createElement(CheckCircle, { className: "w-5 h-5 text-lime-400" });
    if (isError) return React.createElement(XCircle, { className: "w-5 h-5 text-red-400" });
    return icon;
  };

  const getBorderColor = () => {
    if (isSuccess) return 'border-lime-500/30';
    if (isError) return 'border-red-500/30';
    return 'border-gray-500/30';
  };

  const getProgressBarColor = () => {
    if (isSuccess) return 'bg-gradient-to-r from-lime-500 to-lime-400';
    if (isError) return 'bg-gradient-to-r from-red-500 to-red-400';
    return 'bg-gradient-to-r from-gray-500 to-gray-400';
  };

  const getTitleColor = () => {
    if (isSuccess) return 'text-lime-400';
    if (isError) return 'text-red-400';
    return 'text-gray-300';
  };

  const getIconGlow = () => {
    if (isSuccess) return 'shadow-lime-500/25';
    if (isError) return 'shadow-red-500/25';
    return 'shadow-gray-500/25';
  };

  const duration = toastObj.duration || 4000;

  return React.createElement('div', { className: "premium-toast-wrapper" },
    React.createElement('div', { className: `premium-saas-toast ${getBorderColor()}` },
      // Icon Container
      React.createElement('div', { className: `premium-icon-container ${getIconGlow()}` },
        getIcon()
      ),

      // Content
      React.createElement('div', { className: "premium-toast-content" },
        React.createElement('div', { className: `premium-toast-title ${getTitleColor()}` },
          title || description
        )
      ),

      // Close Button
      !isLoading && React.createElement('button', {
        onClick: () => toast.dismiss(id),
        className: "premium-toast-close-btn"
      },
        React.createElement(X, { className: "w-4 h-4" })
      ),

      // Progress Bar
      !isLoading && duration && duration !== Infinity &&
      React.createElement('div', { className: "premium-progress-container" },
        React.createElement('div', {
          className: `premium-progress-bar ${getProgressBarColor()}`,
          style: {
            animation: `shrink ${duration}ms linear forwards`,
          }
        })
      )
    )
  );
};

// Premium SaaS toast variants
export const glassToast = {
  success: (message: string, options?: any) => {
    return toast.custom((id) =>
      React.createElement(PremiumToastRenderer, {
        toast: { type: 'success', duration: 4000, ...options },
        title: message,
        id: id
      })
      , { duration: 4000, ...options });
  },

  error: (message: string, options?: any) => {
    return toast.custom((id) =>
      React.createElement(PremiumToastRenderer, {
        toast: { type: 'error', duration: 6000, ...options },
        title: message,
        id: id
      })
      , { duration: 6000, ...options });
  },


  loading: (message: string, options?: any) => {
    return toast.custom((id) =>
      React.createElement(PremiumToastRenderer, {
        toast: { type: 'loading', duration: Infinity, ...options },
        title: message,
        id: id
      })
      , { duration: Infinity, ...options });
  },

  // Promise-based toast for async operations
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    });
  },

  // Dismiss all toasts
  dismiss: () => {
    toast.dismiss();
  },

  // Dismiss specific toast
  dismissId: (id: string | number) => {
    toast.dismiss(id);
  },
};

// User-friendly error messages (updated for new backend error codes)
export const userFriendlyMessages = {
  // Authentication errors
  INVALID_CREDENTIALS: 'Invalid email or password. Please try again.',
  TOKEN_EXPIRED: 'Your session has expired. Please log in again.',
  TOKEN_MISSING: 'Authentication token is required.',
  INVALID_TOKEN: 'Invalid or corrupted authentication token.',
  ACCESS_DENIED: 'You do not have permission to perform this action.',
  UNAUTHORIZED: 'Authentication required.',
  FORBIDDEN: 'Access denied.',

  // User/Student errors
  USER_NOT_FOUND: 'User not found.',
  USER_EXISTS: 'An account with this email already exists.',
  STUDENT_NOT_FOUND: 'Student not found.',
  STUDENT_EXISTS: 'This student already exists.',
  USERNAME_TAKEN: 'This username is already taken.',
  EMAIL_EXISTS: 'Email already exists.',
  EMAIL_ALREADY_EXISTS: 'Email already exists.',
  ENROLLMENT_ID_EXISTS: 'Enrollment ID already exists.',
  DUPLICATE_ENTRY: 'This record already exists.',
  DUPLICATE_FIELD: 'Duplicate field detected.',

  // Validation errors
  VALIDATION_ERROR: 'Please check your input and try again.',
  INVALID_INPUT: 'Invalid information provided.',
  REQUIRED_FIELD: 'This field is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PASSWORD: 'Password does not meet requirements.',
  INVALID_REFERENCE: 'Invalid reference provided.',

  // Resource errors
  NOT_FOUND: 'Resource not found.',
  NOT_FOUND_ERROR: 'Resource not found.',
  TOPIC_NOT_FOUND: 'Topic not found.',
  CLASS_NOT_FOUND: 'Class not found.',
  QUESTION_NOT_FOUND: 'Question not found.',
  BATCH_NOT_FOUND: 'Batch not found.',

  // Database errors
  DATABASE_ERROR: 'Database operation failed. Please try again.',
  INTERNAL_SERVER_ERROR: 'Internal server error. Please try again.',

  // Network/Server errors
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Something went wrong. Please try again.',
  INTERNAL_ERROR: 'Internal server error. Please try again.',
  SERVICE_UNAVAILABLE: 'Service temporarily unavailable. Please try again later.',

  // File/Upload errors
  FILE_TOO_LARGE: 'File size exceeds the limit.',
  INVALID_FILE_TYPE: 'Invalid file type.',
  UPLOAD_FAILED: 'File upload failed.',
  FILE_UPLOAD_ERROR: 'File upload failed.',

  // Rate limiting
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please wait and try again.',

  // Conflict errors
  CONFLICT: 'Resource conflict detected.',
  QUESTION_LINK_EXISTS: 'Question link already exists.',
  STUDENT_NOT_REGISTERED: 'Student not registered by admin.',
  INVALID_STATE: 'Invalid operation state.',
  UNPROCESSABLE_ENTITY: 'Request could not be processed.',
  BATCH_DUPLICATE: 'A batch with this name and year already exists in this city.',

  // External service errors
  EXTERNAL_SERVICE_ERROR: 'External service error. Please try again.',
  EMAIL_SEND_ERROR: 'Failed to send email. Please try again.',

  // Generic fallback
  ERROR: 'Something went wrong. Please try again.',
  BAD_REQUEST: 'Bad request.',

  // Legacy mappings
  STUDENT_PROFILE_NOT_FOUND: 'Student not found'
};

// Helper function to get user-friendly message
export const getUserFriendlyMessage = (error: any): string => {
  // First check if we have a backend error code
  console.log('Error structure:', {
    status: error?.response?.status,
    data: error?.response?.data,
    message: error?.response?.data?.message,
    error: error?.response?.data?.error,
    code: error?.response?.data?.code
  });
  
  const errorCode = error?.response?.data?.code || error?.code;
  if (errorCode && userFriendlyMessages[errorCode as keyof typeof userFriendlyMessages]) {
    return userFriendlyMessages[errorCode as keyof typeof userFriendlyMessages];
  }

  // Handle specific HTTP status codes with detailed conditions
  const status = error?.response?.status;
  const errorMessage = error?.response?.data?.message;
  
  switch (status) {
    case 400:
      // Check for specific 400 error scenarios
      if (errorMessage?.includes('already exists')) {
        return userFriendlyMessages.DUPLICATE_ENTRY;
      }
      if (errorMessage?.includes('not found')) {
        return userFriendlyMessages.NOT_FOUND;
      }
      if (errorMessage?.includes('Invalid') || errorMessage?.includes('invalid')) {
        return userFriendlyMessages.INVALID_INPUT;
      }
      if (errorMessage?.includes('required') || errorMessage?.includes('Required')) {
        return userFriendlyMessages.REQUIRED_FIELD;
      }
      return userFriendlyMessages.BAD_REQUEST;
      
    case 401:
      // Check for specific 401 error scenarios
      if (errorMessage?.includes('credentials') || errorMessage?.includes('Invalid credentials')) {
        return userFriendlyMessages.INVALID_CREDENTIALS;
      }
      if (errorMessage?.includes('authenticated') || errorMessage?.includes('authentication')) {
        return userFriendlyMessages.UNAUTHORIZED;
      }
      if (errorMessage?.includes('token') || errorMessage?.includes('Token')) {
        return userFriendlyMessages.TOKEN_MISSING;
      }
      return userFriendlyMessages.TOKEN_EXPIRED;
      
    case 403:
      if (errorMessage?.includes('token') || errorMessage?.includes('Token')) {
        return userFriendlyMessages.INVALID_TOKEN;
      }
      if (errorMessage?.includes('permission') || errorMessage?.includes('Permission')) {
        return userFriendlyMessages.ACCESS_DENIED;
      }
      return userFriendlyMessages.FORBIDDEN;
      
    case 404:
      // Check for specific 404 error scenarios
      if (errorMessage?.includes('Student not found') || errorMessage?.includes('student not found')) {
        return userFriendlyMessages.STUDENT_NOT_FOUND;
      }
      if (errorMessage?.includes('Topic')) {
        return userFriendlyMessages.TOPIC_NOT_FOUND;
      }
      if (errorMessage?.includes('Question')) {
        return userFriendlyMessages.QUESTION_NOT_FOUND;
      }
      if (errorMessage?.includes('Batch')) {
        return userFriendlyMessages.BATCH_NOT_FOUND;
      }
      return userFriendlyMessages.NOT_FOUND;
      
    case 409:
      
      return userFriendlyMessages.CONFLICT;
    case 422:
      return userFriendlyMessages.UNPROCESSABLE_ENTITY;
    case 429:
      return userFriendlyMessages.RATE_LIMIT_EXCEEDED;
    case 500:
      return userFriendlyMessages.INTERNAL_SERVER_ERROR;
    case 502:
    case 503:
    case 504:
      return userFriendlyMessages.SERVICE_UNAVAILABLE;
  }

  // Network errors
  if (error?.code === 'ERR_NETWORK' || error?.message === 'Network Error') {
    return userFriendlyMessages.NETWORK_ERROR;
  }

  // Fallback
  return userFriendlyMessages.ERROR;
};

// Enhanced error handler with user-friendly messages
export const handleToastError = (error: any, context?: string) => {
  if (error?.silent || error?.isSilent) return;

  const message = getUserFriendlyMessage(error);
  glassToast.error(message);
};

// Success messages
export const successMessages = {
  LOGIN: 'Logged in successfully!',
  LOGOUT: 'Logged out successfully!',
  REGISTER: 'Account created successfully!',
  PASSWORD_RESET: 'Password reset successfully!',
  PASSWORD_UPDATED: 'Password updated successfully!',
  CREATE: 'Created successfully!',
  UPDATE: 'Updated successfully!',
  DELETE: 'Deleted successfully!',
  FILE_UPLOADED: 'File uploaded successfully!',
  FILE_DOWNLOADED: 'File downloaded successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  CUSTOM: 'Operation completed successfully!',
  EMAIL_SENT: 'Email sent successfully!',
};

// Success notification helper
export const showSuccess = (action: keyof typeof successMessages | string, customMessage?: string) => {
  const message = customMessage || successMessages[action as keyof typeof successMessages] || `${action} successful!`;
  glassToast.success(message);
};

// Delete notification helper
export const showDeleteSuccess = (entity: string, customMessage?: string) => {
  const message = customMessage || `${entity} deleted successfully!`;
  glassToast.error(message);
};

// Loading state helper
export const showLoading = (action: string) => {
  glassToast.loading(`${action}...`);
};


// Login flow with promise toast
export const showLoginPromise = (loginPromise: Promise<any>) => {
  return glassToast.promise(loginPromise, {
    loading: 'Logging in...',
    success: 'Login successful! ',
    error: 'Login failed',
  });
};

// Signup flow with promise toast
export const showSignupPromise = (signupPromise: Promise<any>) => {
  return glassToast.promise(signupPromise, {
    loading: 'Creating account...',
    success: 'Account created successfully!',
    error: 'Failed to create account',
  });
};

// Form submission with promise toast
export const showFormPromise = <T>(
  formPromise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error: string;
  }
) => {
  return glassToast.promise(formPromise, messages);
};

export default {
  glassToast,
  handleToastError,
  showSuccess,
  showDeleteSuccess,
  showLoading,
  showLoginPromise,
  showSignupPromise,
  showFormPromise,
  toastConfig,
  userFriendlyMessages,
  successMessages,
  getUserFriendlyMessage,
};
