import * as Yup from 'yup';
import mobileRegex from '../constants/mobile-regex';
import messages from '../constants/messages';
import passwordRegex from '../constants/password-regex';

export const editSchema= Yup.object({
    name: Yup.string().required(),
    email: Yup.string().email().required(),
    age : Yup.number().required().min(18).max(60),
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
    age : Yup.number().required().min(18).max(60),
    mobile :  Yup.string().required().matches(mobileRegex, messages.update.error.invalidMobile),
    addressLine1: Yup.string().required().max(100),
    addressLine2: Yup.string().required().max(100),
    city: Yup.string().required().max(100),
    state: Yup.string().required().max(100),
    country: Yup.string().required().max(100),
    postalCode: Yup.string().required().max(100),
    role: Yup.string().required(),
    gender: Yup.string().required(),
})

export const applyLeaveSchema = Yup.object({
    leaveType: Yup.string().required(),
    startDate: Yup.date().required(),
    endDate : Yup.date().required(),
    reasonForLeave :  Yup.string().required()
})


