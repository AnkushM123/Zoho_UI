const messages = {
    login: {
        success: {
            "toastSuccess": "Login Successful",
        },
        error: {
            "emailRequired": "Email is required",
            "passwordRequired": "Password is required",
            "toastError": "Credentials are invalid",
        }
    },
    varifyEmail: {
        error: {
            "emailRequired": "Email is required",
            "invalidEmail": "Email is invalid",
            "emailNotExist": "Email do not exist"
        }
    },
    setPassword: {
        success: {
            "passwordChanged": "Password changed successfully"
        },
        error: {
            "passwordRequired": "Password is required",
            "confirmPasswordRequired": "Confirm password is required",
            "passwordValidation": "Password must contain at least 8 characters, one uppercase,one lowercase, one number and one special case character",
            "passwordUnmatched": "Both passwords do not match"
        }
    },
    update: {
        success: {
            "userUpdated": 'Employee Updated',
        },
        error: {
            "nameRequired": "Name is required",
            "emailRequired": "Email is required",
            "invalidEmail": "Email is invalid",
            "ageRequired": "Age is required",
            "invalidAge": "Age must be within 60",
            "mobileRequired": "Mobile number is required",
            "invalidMobile": "Mobile number is invalid",
            "addressLine1Required": "Address line 1 is required",
            "invalidAddressLine1": "Address line1 length must be within 200 words",
            "addressLine2Required": "Address line 2 is required",
            "invalidAddressLine2": "Address line 2 length must be within 200 words",
            "cityRequired": "City is required",
            "invalidCity": "City length must be within 200 words",
            "stateRequired": "State is required",
            "invalidState": "State length must be within 200 words",
            "countryRequired": "Country is required",
            "invalidCountry": "Country length must be within 200 words",
            "postalCodeRequired": "Postal code is required",
            "invalidPostalCode": "Postal code length must be within 200 words",
            "emailRegistered": 'Email is already registered'
        }
    },
    register: {
        success: {
            "employeeRegistered": 'Employee registered successfully'
        },
        error: {
            "emailAlreadyExist": 'Email is already registered',
            "nameRequired": "Name is required",
            "emailRequired": "Email is required",
            "invalidEmail": "Email is invalid",
            "passwordRequired": "Password is required",
            "invalidPassword": "Password must contain at least 8 characters, one uppercase,one lowercase, one number and one special case character",
            "DobRequired": "Date of birth is required",
            "invalidAge": "Age must be within 60",
            "mobileRequired": "Mobile number is required",
            "invalidMobile": "Mobile number is invalid",
            "addressLine1Required": "Address line 1 is required",
            "invalidAddressLine1": "Address line1 length must be within 200 words",
            "addressLine2Required": "Address line 2 is required",
            "invalidAddressLine2": "Address line 2 length must be within 200 words",
            "cityRequired": "City is required",
            "invalidCity": "City length must be within 200 words",
            "stateRequired": "State is required",
            "invalidState": "State length must be within 200 words",
            "countryRequired": "Country is required",
            "invalidCountry": "Country length must be within 200 words",
            "postalCodeRequired": "Postal code is required",
            "invalidPostalCode": "Postal code length must be within 200 words",
            "roleRequired": "Role is required",
            "genderRequired": "Gender is required",
            "imageRequired": "Image is required",
            "respondingToRequired": "Select manager or admin",
            "ageValidation": "Employee age should be over 18",
            "fileValidation": "Selected file is not image"
        }
    },
    applyLeave: {
        success: {
            "requestSuccess": "Leave request sent successfully"
        },
        error: {
            "leaveTypeRequired": "Please select leave type",
            "startDateRequired": "Please select start date of leave",
            "endDateRequired": "Please select end date of leave",
            "reasonForLeaveRequired": "Please select reason of leave",
            "startDateGreater": "Start date should not be greater than end date",
            "invalidReasonForLeave": "Reason for leave should ne within 200 words"
        }
    },
    protectedRoute: {
        error: {
            "loginRequired": "Login is required"
        }
    },
    addLeave: {
        success: {
            "leaveAdded": "Leave added successfully"
        },
        error: {
            "daysRequired": "Please select number of days",
            "employeeRequired": "Please select employee name",
            "invalidDays": "Number of days are invalid",
            "daysRange": "Total days should be within 20 days",
            "startDateRequired": "Please select starting compensantory off day",
            "endDateRequired": "Please select ending compensantory off day",
            "startDateGreater": "Start date should not be greater than end date",
        }
    },
    changePassword: {
        success: {
            "passwordChanged": "Password changed successfully"
        },
        error: {
            "passwordRequired": "Please enter new password",
            "oldPasswordRequired": "Please enter old password",
            "confirmOldPasswordRequired": "Please enter confirm old password",
            "confirmPasswordRequired": "Please enter confirm new password",
            "invalidPassword": "Password must contain at least 8 characters, one uppercase,one lowercase, one number and one special case character",
            "NewBothUnmatched": "New password and confirm new password do not match",
            "oldPasswordUnmatched": "You have entered invalid old password"
        }
    }
}

export default messages;