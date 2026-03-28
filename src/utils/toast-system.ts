import { toast } from 'sonner';
import { operationToasts } from '@/components/ui/toast-provider';

// Toast configuration with consistent styling
export const toastConfig = {
  position: 'top-center' as const,
  theme: 'dark' as const,
  richColors: true,
  closeButton: true,
  duration: 4000,
};

// Error code mapping from backend to user-friendly messages
export const errorMap: Record<string, string> = {
  // Authentication errors
  AUTH_ERROR: 'Authentication failed. Please check your credentials.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  TOKEN_EXPIRED: 'Your session has expired. Please log in again.',
  ACCESS_DENIED: 'You do not have permission to perform this action.',
  
  // User/Student errors
  USER_NOT_FOUND: 'User not found.',
  USER_EXISTS: 'User already exists.',
  STUDENT_NOT_FOUND: 'Student not found.',
  STUDENT_EXISTS: 'Student already exists.',
  USERNAME_TAKEN: 'Username is already taken.',
  
  // Validation errors
  VALIDATION_ERROR: 'Please check your input and try again.',
  INVALID_INPUT: 'Invalid input provided.',
  REQUIRED_FIELD: 'This field is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PASSWORD: 'Password must meet the requirements.',
  
  // Resource errors
  NOT_FOUND_ERROR: 'Resource not found.',
  TOPIC_NOT_FOUND: 'Topic not found.',
  CLASS_NOT_FOUND: 'Class not found.',
  QUESTION_NOT_FOUND: 'Question not found.',
  BATCH_NOT_FOUND: 'Batch not found.',
  
  // Database errors
  DATABASE_ERROR: 'Database operation failed. Please try again.',
  DUPLICATE_ENTRY: 'This record already exists.',
  
  // Network/Server errors
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Something went wrong. Please try again.',
  INTERNAL_ERROR: 'Internal server error. Please try again.',
  SERVICE_UNAVAILABLE: 'Service temporarily unavailable. Please try again later.',
  
  // File/Upload errors
  FILE_TOO_LARGE: 'File size exceeds the limit.',
  INVALID_FILE_TYPE: 'Invalid file type.',
  UPLOAD_FAILED: 'File upload failed.',
  
  // Rate limiting
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please wait and try again.',
  
  // Authorization errors
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  
  // Generic fallback
  ERROR: 'Something went wrong. Please try again.',
};

// Success message templates
export const successMessages = {
  // Auth
  LOGIN: 'Logged in successfully!',
  LOGOUT: 'Logged out successfully!',
  REGISTER: 'Account created successfully!',
  PASSWORD_RESET: 'Password reset successfully!',
  PASSWORD_UPDATED: 'Password updated successfully!',
  
  // CRUD operations
  CREATE: 'Created successfully!',
  ADMIN_CREATED: 'Admin created successfully!',
  ADMIN_UPDATED: 'Admin updated successfully!',
  
  // City operations
  CITY_CREATED: 'City created successfully!',
  CITY_UPDATED: 'City updated successfully!',
  
  // Batch operations
  BATCH_CREATED: 'Batch created successfully!',
  BATCH_UPDATED: 'Batch updated successfully!',
  
  // Topic operations
  TOPIC_CREATED: 'Topic created successfully!',
  TOPIC_UPDATED: 'Topic updated successfully!',
  
  // Class operations
  CLASS_CREATED: 'Class created successfully!',
  CLASS_UPDATED: 'Class updated successfully!',
  
  // Question operations
  QUESTION_CREATED: 'Question created successfully!',
  QUESTION_UPDATED: 'Question updated successfully!',
  
  // Student operations
  STUDENT_CREATED: 'Student created successfully!',
  STUDENT_UPDATED: 'Student updated successfully!',
  
  // File operations
  FILE_UPLOADED: 'File uploaded successfully!',
  FILE_DOWNLOADED: 'File downloaded successfully!',
  
  // Profile operations
  PROFILE_UPDATED: 'Profile updated successfully!',
  
  // Generic success
  CUSTOM: 'Operation completed successfully!',
  EMAIL_SENT: 'Email sent successfully!',
};

// Enhanced toast functions with Lucide icons
export const showToast = {
  success: (message: string, options?: any) => {
    return operationToasts.success(message);
  },
  
  error: (message: string, options?: any) => {
    return operationToasts.error(message);
  },
  
  warning: (message: string, options?: any) => {
    return operationToasts.warning(message);
  },
  
  info: (message: string, options?: any) => {
    return operationToasts.info(message);
  },
  
  loading: (message: string, options?: any) => {
    return operationToasts.loading(message);
  },
};

// Helper function to get user-friendly error message
export const getErrorMessage = (error: any): string => {
  // First check if we have a backend error code
  const errorCode = error?.response?.data?.code || error?.code;
  if (errorCode && errorMap[errorCode]) {
    return errorMap[errorCode];
  }

  // Check for backend message but only if it's user-friendly
  const backendMessage = error?.response?.data?.message;
  if (backendMessage && !backendMessage.includes('/') && !backendMessage.includes('Error') && !backendMessage.includes('Exception')) {
    // Map common backend messages to user-friendly ones
    switch (backendMessage) {
      case 'Email already exists':
        return 'An account with this email already exists.';
      case 'Username already exists':
        return 'This username is already taken.';
      case 'Student not found':
        return 'Student not found.';
      case 'Admin not found':
        return 'Admin not found.';
      case 'City not found':
        return 'City not found.';
      case 'Batch not found':
        return 'Batch not found.';
      case 'Topic not found':
        return 'Topic not found.';
      case 'City already exists':
        return 'A city with this name already exists.';
      case 'Batch with same name and year already exists in this city':
        return 'A batch with this name and year already exists in this city.';
      case 'Topic already exists':
        return 'A topic with this name already exists.';
      case 'Cannot delete city with active batches':
        return 'Cannot delete city with active batches.';
      case 'Cannot delete city with active students':
        return 'Cannot delete city with active students.';
      case 'Cannot delete batch with active students':
        return 'Cannot delete batch with active students.';
      case 'Email, username, or enrollment_id already exists':
        return 'An account with this email, username, or enrollment ID already exists.';
      case 'Name, email, username, password, and batch_id are required':
        return 'Please fill in all required fields.';
      case 'Invalid batch_id':
        return 'Invalid batch selected.';
      case 'All fields are required':
        return 'All fields are required.';
      case 'City name is required':
        return 'City name is required.';
      case 'City name is missing':
        return 'City name is missing.';
      case 'City name already in use':
        return 'This city name is already in use.';
      case 'Duplicate entry found':
        return 'This record already exists.';
      case 'Email, Username or Enrollment ID already exists':
        return 'Email, username, or enrollment ID already exists.';
      case 'Username already exists':
        return 'This username is already taken.';
      case 'Enrollment ID already exists':
        return 'This enrollment ID already exists.';
      case 'Google account already linked':
        return 'This Google account is already linked to another account.';
      case 'Invalid city or batch reference':
        return 'Invalid city or batch selected.';
      case 'Invalid batch reference':
        return 'Invalid batch selected.';
      case 'Student already solved this question':
        return 'You have already solved this question.';
      case 'Invalid student or question reference':
        return 'Invalid student or question reference.';
      case 'Failed to create student':
        return 'Failed to create student. Please try again.';
      case 'Failed to update student':
        return 'Failed to update student. Please try again.';
      case 'Failed to delete student':
        return 'Failed to delete student. Please try again.';
      case 'Failed to fetch students':
        return 'Failed to fetch students. Please try again.';
      case 'Failed to fetch student report':
        return 'Failed to fetch student report. Please try again.';
      case 'Failed to add student progress':
        return 'Failed to add student progress. Please try again.';
      default:
        return backendMessage;
    }
  }

  // Handle specific HTTP status codes
  const status = error?.response?.status;
  switch (status) {
    case 400:
      return errorMap.VALIDATION_ERROR;
    case 401:
      return errorMap.TOKEN_EXPIRED;
    case 403:
      return errorMap.FORBIDDEN;
    case 404:
      return errorMap.NOT_FOUND_ERROR;
    case 429:
      return errorMap.RATE_LIMIT_EXCEEDED;
    case 500:
      return errorMap.SERVER_ERROR;
    case 502:
    case 503:
    case 504:
      return errorMap.SERVICE_UNAVAILABLE;
  }

  // Network errors
  if (error?.code === 'ERR_NETWORK' || error?.message === 'Network Error') {
    return errorMap.NETWORK_ERROR;
  }

  // Fallback
  return errorMap.ERROR;
};

// Enhanced error handler with toast integration
export const handleApiError = (error: any, context?: string) => {
  // Don't show toast for silent errors (like token refresh failures)
  if (error?.silent || error?.isSilent) {
    return;
  }

  // Log error in development for debugging
  // if (process.env.NODE_ENV === 'development') {
  //   console.group(`API Error ${context ? `in ${context}` : ''}`);
  //   console.error('Error:', error);
  //   console.error('Status:', error?.response?.status);
  //   console.error('Data:', error?.response?.data);
  //   console.groupEnd();
  // }

  const userMessage = getErrorMessage(error);
  showToast.error(userMessage);
};

// Success notification helper with Lucide icons
export const showSuccess = (action: keyof typeof successMessages | string, customMessage?: string) => {
  const message = customMessage || successMessages[action as keyof typeof successMessages] || `${action} successful!`;
  
  // Use operation-specific toast if action matches
  if (typeof action === 'string' && operationToasts[action as keyof typeof operationToasts]) {
    return (operationToasts as any)[action](customMessage);
  }
  
  // Fallback to generic success toast
  return operationToasts.success(message);
};

// Delete notification helper (shows red toast for destructive actions with Lucide icons)
export const showDeleteSuccess = (entity: string, customMessage?: string) => {
  const message = customMessage || `${entity} deleted successfully!`;
  const operationKey = `${entity.toUpperCase()}_DELETED` as keyof typeof operationToasts;
  
  // Use specific delete toast if available
  if (operationToasts[operationKey]) {
    return (operationToasts as any)[operationKey](customMessage);
  }
  
  // Fallback to generic error toast for delete
  return operationToasts.error(message);
};

// Loading state helper
export const showLoading = (action: string) => {
  return showToast.loading(`${action}...`);
};

// Dismiss all toasts helper
export const dismissAllToasts = () => {
  toast.dismiss();
};

export default {
  showToast,
  handleApiError,
  showSuccess,
  showLoading,
  dismissAllToasts,
  errorMap,
  successMessages,
  getErrorMessage,
};
