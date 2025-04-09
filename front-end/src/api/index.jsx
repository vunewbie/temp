// AuthsAPI
import {
    normalLoginAPI,
    logoutAPI,
    refreshTokenAPI,
    googleLoginAPI,
    facebookLoginAPI,
    gitHubLoginAPI,
    customerRegisterAPI,
    registerVerifyOTPAPI,
    resendRegisterOTPAPI,
    forgotPasswordAPI,
    forgotPasswordVerifyOTPAPI,
    resendForgotPasswordOTPAPI,
    resetPasswordAPI,
    changePasswordAPI,
    getGoogleOAuth2CodeAPI,
    getFacebookOAuth2CodeAPI,
    getGitHubOAuth2CodeAPI
} from './accounts/AuthsAPI';

// AdminAPI
import {
    retrieveAdminInfoAPI,
    updateAdminInfoAPI
} from './accounts/AdminAPI';

// CustomerAPI
import {
    retrieveCustomerInfoAPI,
    updateCustomerInfoAPI
} from './accounts/CustomerAPI';

// EmployeeAPI
import {
    retrieveEmployeeInfoAPI,
    updateEmployeeInfoAPI,
    fireEmployeeAPI,
    listEmployeeInfoAPI
} from './accounts/EmployeeAPI';

// ManagerAPI
import {
    retrieveManagerInfoAPI,
    updateManagerInfoAPI
} from './accounts/ManagerAPI';

// DepartmentAPI
import {
    listDepartmentInfoAPI
} from './establishments/DepartmentAPI';

// BranchAPI
import {
    listBranchInfoAPI
} from './establishments/BranchAPI';

// AreaAPI
import {
    listAreaInfoAPI,
    updateAreaInfoAPI
} from './establishments/AreaAPI';

// CategoryAPI
import {
    listCategoryAPI,
    createCategoryAPI,
    updateCategoryAPI,
    deleteCategoryAPI
} from './menu/CategoryAPI';

// DishAPI
import {
    listDishAPI,
    createDishAPI,
    updateDishAPI,
    deleteDishAPI
} from './menu/DishAPI';

export {
    // AuthsAPI
    normalLoginAPI,
    logoutAPI,
    refreshTokenAPI,
    googleLoginAPI,
    facebookLoginAPI,
    gitHubLoginAPI,
    customerRegisterAPI,
    registerVerifyOTPAPI,
    resendRegisterOTPAPI,
    forgotPasswordAPI,
    forgotPasswordVerifyOTPAPI,
    resendForgotPasswordOTPAPI,
    resetPasswordAPI,
    changePasswordAPI,
    getGoogleOAuth2CodeAPI,
    getFacebookOAuth2CodeAPI,
    getGitHubOAuth2CodeAPI,
    
    // AdminAPI
    retrieveAdminInfoAPI,
    updateAdminInfoAPI,
    
    // CustomerAPI
    retrieveCustomerInfoAPI,
    updateCustomerInfoAPI,
    
    // EmployeeAPI
    retrieveEmployeeInfoAPI,
    updateEmployeeInfoAPI,
    fireEmployeeAPI,
    listEmployeeInfoAPI,
    
    // ManagerAPI
    retrieveManagerInfoAPI,
    updateManagerInfoAPI,
    
    // DepartmentAPI
    listDepartmentInfoAPI,
    
    // BranchAPI
    listBranchInfoAPI,
    
    // AreaAPI
    listAreaInfoAPI,
    updateAreaInfoAPI,

    // CategoryAPI
    listCategoryAPI,
    createCategoryAPI,
    updateCategoryAPI,
    deleteCategoryAPI,

    // DishAPI
    listDishAPI,
    createDishAPI,
    updateDishAPI,
    deleteDishAPI
};