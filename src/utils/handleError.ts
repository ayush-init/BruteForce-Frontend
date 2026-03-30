"use client";

// Re-export error handling functions from toast-system
export { handleToastError as handleError, showSuccess } from './toast-system';

// Also export other commonly used functions for convenience
export { 
  glassToast, 
  showDeleteSuccess, 
  showLoading, 
  showInfo, 
  showWarning,
  getUserFriendlyMessage,
  userFriendlyMessages,
  successMessages
} from './toast-system';
