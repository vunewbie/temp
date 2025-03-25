// Import từ errorTranslator.jsx
import { translateErrorMessage } from './errorTranslator';

// Import từ phoneNumberHelper.jsx
import { 
  formatPhoneNumberForDisplay,
  formatPhoneNumberForAPI 
} from './phoneNumberHelper';

// Import từ tokenHelper.jsx
import { 
  decodeToken,
  isExpiredToken,
  checkAccessToken,
  getUserFromToken,
  removeAxiosInterceptors,
  setupAxiosInterceptors
} from './tokenHelper';

// Import from passwordChecker.jsx
import {
  validatePassword,
  validateConfirmPassword,
  validatePasswordWithConfirmation,
  getPasswordRequirements
} from './passwordChecker';

// Export tất cả tiện ích
export {
  // errorTranslator
  translateErrorMessage,
  
  // phoneNumberHelper
  formatPhoneNumberForDisplay,
  formatPhoneNumberForAPI,
  
  // tokenHelper
  decodeToken,
  isExpiredToken,
  checkAccessToken,
  getUserFromToken,
  removeAxiosInterceptors,
  setupAxiosInterceptors,
  
  // passwordChecker
  validatePassword,
  validateConfirmPassword,
  validatePasswordWithConfirmation,
  getPasswordRequirements
};
