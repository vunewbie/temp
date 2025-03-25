// Format phone number for display
export const formatPhoneNumberForDisplay = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  // Remove all non-numeric characters
  const cleanedNumber = phoneNumber.replace(/\D/g, '');
  
  // If phone number starts with 84, convert to domestic format
  if (cleanedNumber.startsWith('84')) {
    return '0' + cleanedNumber.substring(2);
  }
  
  // If phone number starts with 0, keep it
  if (cleanedNumber.startsWith('0')) {
    return cleanedNumber;
  }
  
  // If phone number doesn't start with 0, add 0 in front
  return '0' + cleanedNumber;
};

// Format phone number for API
export const formatPhoneNumberForAPI = (phoneNumber) => {
  if (!phoneNumber) return null;
  
  // Remove all non-numeric characters
  const cleanedNumber = phoneNumber.replace(/\D/g, '');
  
  // If phone number starts with 0, replace with +84
  if (cleanedNumber.startsWith('0')) {
    return '+84' + cleanedNumber.substring(1);
  }
  
  // If phone number doesn't start with 84, add +84
  if (!cleanedNumber.startsWith('84')) {
    return '+84' + cleanedNumber;
  }
  
  // If phone number already has country code 84, add +
  return '+' + cleanedNumber;
};
