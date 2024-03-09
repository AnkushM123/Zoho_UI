import * as Yup from 'yup';
import mobileRegex from '../constants/mobile-regex';
import messages from '../constants/messages';
import passwordRegex from '../constants/password-regex';

export const editSchema= Yup.object({
    name: Yup.string().required(),
    mobile :  Yup.string().required().matches(mobileRegex, messages.update.error.invalidMobile),
    addressLine1: Yup.string().required().max(100),
    addressLine2: Yup.string().required().max(100),
    city: Yup.string().required().max(100),
    state: Yup.string().required().max(100),
    country: Yup.string().required().max(100),
    postalCode: Yup.string().required().max(100),
})

export const loginSchema= Yup.object({
    email:Yup.string().email().required(),
    password: Yup.string().required()
})

export const setPasswordSchema = Yup.object({
    password: Yup.string().required().matches(passwordRegex, messages.setPassword.error.passwordValidation),
    confirmPassword: Yup.string()
    .required()
    .matches(passwordRegex, messages.setPassword.error.passwordValidation)
    .oneOf([Yup.ref('password')], messages.setPassword.error.passwordUnmatched),
})

export const varifyEmailSchema= Yup.object({
    email:Yup.string().email().required(),
})

export const registerSchema = Yup.object({
    name: Yup.string().required(),
    email: Yup.string().email().required(),
    password: Yup.string().required().matches(passwordRegex, messages.setPassword.error.passwordValidation),
    dob : Yup.date().required(),
    mobile :  Yup.string().required().matches(mobileRegex, messages.update.error.invalidMobile),
    addressLine1: Yup.string().required().max(100),
    addressLine2: Yup.string().required().max(100),
    city: Yup.string().required().max(100),
    state: Yup.string().required().max(100),
    country: Yup.string().required().max(100),
    postalCode: Yup.string().required().max(100),
    role: Yup.string().required(),
    managerId: Yup.string().required(),
    gender: Yup.string().required(),
})

export const applyLeaveSchema = Yup.object({
    leaveType: Yup.string().required(),
    startDate: Yup.date().required(),
    endDate : Yup.date().required(),
    reasonForLeave :  Yup.string().required()
})

export const addLeaveSchema = Yup.object({
    selectedUser: Yup.string().required(),
    startDate: Yup.date().required(),
    endDate : Yup.date().required(),
    reasonForLeave :  Yup.string().required(),
    totalDays : Yup.number().min(0).max(20),
})

export const changePasswordSchema = Yup.object({
    newPassword: Yup.string().required().matches(passwordRegex, messages.setPassword.error.passwordValidation),
    confirmNewPassword: Yup.string().required().matches(passwordRegex, messages.setPassword.error.passwordValidation).oneOf([Yup.ref('newPassword')], messages.setPassword.error.passwordUnmatched),
    oldPassword: Yup.string().required(),
})

