// validate if a password meets security requirements
export const validatePassword = (password) => {
    const result = {
    isValid: true,
    hasMinLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasDigit: /[0-9]/.test(password),
    hasSpecialChar: /[^A-Za-z0-9]/.test(password),
    errors: []
    };

    // check minimum length
    if (!result.hasMinLength) {
        result.errors.push('Mật khẩu phải có ít nhất 8 ký tự');
        result.isValid = false;
    }

    // check uppercase letter
    if (!result.hasUpperCase) {
        result.errors.push('Mật khẩu phải có ít nhất 1 ký tự hoa');
        result.isValid = false;
    }

    // check lowercase letter
    if (!result.hasLowerCase) {
        result.errors.push('Mật khẩu phải có ít nhất 1 ký tự thường');
        result.isValid = false;
    }

    // check digit
    if (!result.hasDigit) {
        result.errors.push('Mật khẩu phải có ít nhất 1 chữ số');
        result.isValid = false;
    }

    // check special character
    if (!result.hasSpecialChar) {
        result.errors.push('Mật khẩu phải có ít nhất 1 ký tự đặc biệt');
        result.isValid = false;
    }

    return result;
};

// validate if confirmation password matches the main password
export const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) {
    return {
        isValid: false,
        error: 'Vui lòng xác nhận mật khẩu'
    };
    }

    if (password !== confirmPassword) {
    return {
        isValid: false,
        error: 'Xác nhận mật khẩu không khớp'
    };
    }

    return {
    isValid: true,
    error: ''
    };
};

// combined validation for both password and confirmation password
export const validatePasswordWithConfirmation = (password, confirmPassword) => {
    const passwordResult = validatePassword(password);
    const confirmResult = validateConfirmPassword(password, confirmPassword);
    const isValid = passwordResult.isValid && confirmResult.isValid;
    const errors = [...passwordResult.errors];

    if (!confirmResult.isValid) {
    errors.push(confirmResult.error);
    }

    return {
    isValid,
    errors
    };
};

// get a list of password requirements as text items
export const getPasswordRequirements = () => {
    return [
        '8 ký tự',
        '1 chữ cái hoa',
        '1 chữ cái thường', 
        '1 chữ số',
        '1 ký tự đặc biệt'
    ];
};

export default {
    validatePassword,
    validateConfirmPassword,
    validatePasswordWithConfirmation,
    getPasswordRequirements
};
