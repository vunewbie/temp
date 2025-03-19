// Translate error message
export const translateErrorMessage = (errorMessage) => {
    const errorMap = {
        // Username
        "A user with that username already exists.": "Tên đăng nhập đã tồn tại.",
        "Username is required.": "Vui lòng nhập tên đăng nhập.",
        "Username must be at least 3 characters long.": "Tên đăng nhập phải có ít nhất 3 ký tự.",
        
        // Email
        "user with this email already exists.": "Email đã tồn tại.",
        "Email is required.": "Vui lòng nhập email.",
        "Enter a valid email address.": "Email không hợp lệ.",
        
        // Password
        "Password is required.": "Vui lòng nhập mật khẩu.",
        "Password must be at least 8 characters long.": "Mật khẩu phải có ít nhất 8 ký tự.",
        "Password is too common.": "Mật khẩu quá đơn giản.",
        "This password is too short. It must contain at least 8 characters.": "Mật khẩu quá ngắn. Mật khẩu phải có ít nhất 8 ký tự.",
        "Password is entirely numeric.": "Mật khẩu không được chỉ chứa số.",
        
        // General
        "Unable to connect to server": "Không thể kết nối đến máy chủ",
        "Registration failed": "Đăng ký thất bại",
        "An error occurred during registration": "Đã xảy ra lỗi khi đăng ký"
    };

    return errorMap[errorMessage] || errorMessage;
}; 