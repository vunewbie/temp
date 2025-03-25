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
        
        // Phone Number
        "Enter a valid phone number.": "Vui lòng nhập số điện thoại hợp lệ.",
        "The phone number entered is not valid.": "Số điện thoại nhập vào không hợp lệ.",
        "A valid phone number is required.": "Yêu cầu số điện thoại hợp lệ.",
        "user with this phone number already exists.": "Số điện thoại này đã được sử dụng.",
        "Phone number must be in the format:": "Số điện thoại phải theo định dạng:",
        "Invalid phone number format.": "Định dạng số điện thoại không hợp lệ.",
        "The phone number is invalid.": "Số điện thoại không hợp lệ.",
        "Enter a valid phone number (e.g. +84xxxxxxxxx).": "Nhập số điện thoại hợp lệ (VD: +84xxxxxxxxx hoặc 0xxxxxxxxx).",
        "The string supplied did not seem to be a phone number.": "Chuỗi được cung cấp không phải là số điện thoại.",
        "The phone number supplied is not a number.": "Số điện thoại cung cấp không phải là số.",
        "Number is too short.": "Số điện thoại quá ngắn.",
        "Number is too long.": "Số điện thoại quá dài.",
        "The phone number supplied is not from a region that has been enabled for this app.": "Số điện thoại cung cấp không thuộc khu vực đã kích hoạt cho ứng dụng này.",
        
        // Citizen ID
        "user with this citizen id already exists.": "Căn cước công dân này đã được sử dụng.",
        "Citizen ID must be 12 digits.": "Căn cước công dân phải có 12 chữ số.",
        "Citizen ID must be numeric.": "Căn cước công dân chỉ được chứa số.",
        "This field cannot be null.": "Trường này không được để trống.",
        "This field cannot be blank.": "Trường này không được để trống.",
        "Ensure this field has no more than 12 characters.": "Đảm bảo trường này có tối đa 12 ký tự.",
        
        // Date Fields
        "Date has wrong format. Use one of these formats instead: YYYY-MM-DD.": "Ngày không đúng định dạng. Vui lòng sử dụng định dạng: YYYY-MM-DD.",
        "The submitted data was not a file. Check the encoding type on the form.": "Dữ liệu tải lên không phải là tệp. Vui lòng kiểm tra lại.",
        
        // Form Fields
        "This field is required.": "Trường này là bắt buộc.",
        "This field may not be blank.": "Trường này không được để trống.",
        "Ensure this value has at most 100 characters.": "Đảm bảo giá trị này có tối đa 100 ký tự.",
        "Ensure this value has at most 12 characters.": "Đảm bảo giá trị này có tối đa 12 ký tự.",
        
        // General
        "Unable to connect to server": "Không thể kết nối đến máy chủ",
        "Registration failed": "Đăng ký thất bại",
        "An error occurred during registration": "Đã xảy ra lỗi khi đăng ký"
    };

    return errorMap[errorMessage] || errorMessage;
}; 