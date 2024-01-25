const messages = {
    login: {
        success: {
            "toastSuccess": "Successful Login",
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
    }
}

export default messages;