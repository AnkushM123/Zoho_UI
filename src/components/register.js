import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./layout";
import messages from "../core/constants/messages";
import mobileRegex from "../core/constants/mobile-regex";
import emailRegex from "../core/constants/email-regex";
import passwordRegex from "../core/constants/password-regex";
import { configureToastOptions } from "../core/services/toast-service";
import authService from "../core/services/auth-service";

function Register() {
    const navigate = useNavigate();
    const [inputData, setInputData] = useState({
        email: '',
        password: '',
        name: '',
        age: '',
        mobile: '',
        address: {
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            country: '',
            postalCode: '',
        }
    })
    const [role, setRole] = useState('');
    const [file, setFile] = useState(null);
    const [error, setError] = useState({})
    const [emailMessage, setEmailMessage] = useState('')
    const [gender, setGender] = useState('');
    const jwtToken = localStorage.getItem('authToken');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const checkEmail = async () => {
        try {
            await authService.varifyEmail({ email: inputData.email });
            setEmailMessage(messages.register.error.emailAlreadyExist);
            return true;
        } catch (error) {
            setEmailMessage('');
            const toastOptions = configureToastOptions();
            toast.options = toastOptions;
            toast.error(messages.login.error.toastError);
        }
    }

    const validation = async () => {
        const error = {}
        if (!inputData.name.trim()) {
            error.name = messages.register.error.nameRequired;
        }

        if (!inputData.email.trim()) {
            error.email = messages.register.error.emailRequired;
        } else {
            if (!emailRegex.test(inputData.email)) {
                error.email = messages.register.error.invalidEmail;
            }
        }

        if (!inputData.password.trim()) {
            error.password = messages.register.error.passwordRequired;
        } else if (!passwordRegex.test(inputData.password)) {
            error.password = messages.register.error.invalidPassword;
        }

        if (!inputData.age) {
            error.age = messages.register.error.ageRequired;
        } else if (!(0 < inputData.age && 60 >= inputData.age)) {
            error.age = messages.register.error.invalidAge;
        }

        if (!inputData.mobile.trim()) {
            error.mobile = messages.register.error.mobileRequired;
        } else if (!mobileRegex.test(inputData.mobile)) {
            error.mobile = messages.register.error.invalidMobile;
        }

        if (!inputData.address.addressLine1.trim()) {
            error.addressLine1 = messages.register.error.addressLine1Required;
        } else if (inputData.address.addressLine1.length > 200) {
            error.addressLine1 = messages.register.error.invalidAddressLine1;
        }

        if (!inputData.address.addressLine2.trim()) {
            error.addressLine2 = messages.register.error.addressLine2Required;
        } else if (inputData.address.addressLine1.length > 200) {
            error.addressLine2 = messages.register.error.invalidAddressLine2;
        }

        if (!inputData.address.city.trim()) {
            error.city = messages.register.error.cityRequired;
        } else if (inputData.address.city.length > 200) {
            error.city = messages.register.error.invalidCity;
        }

        if (!inputData.address.state.trim()) {
            error.state = messages.register.error.stateRequired;
        } else if (inputData.address.state.length > 200) {
            error.state = messages.register.error.invalidState;
        }

        if (!inputData.address.country.trim()) {
            error.country = messages.register.error.countryRequired;
        } else if (inputData.address.country.length > 200) {
            error.country = messages.register.error.invalidCountry;
        }

        if (!inputData.address.postalCode.trim()) {
            error.postalCode = messages.register.error.postalCodeRequired;
        } else if (inputData.address.postalCode.length > 200) {
            error.postalCode = messages.register.error.invalidPostalCode;
        }

        if (!role) {
            error.role = messages.register.error.roleRequired;
        }

        if (!gender) {
            error.gender = messages.register.error.genderRequired;
        }

        if (!file) {
            error.file = messages.register.error.imageRequired;
        }
        setError(error);
        if (await checkEmail()) {
            return true;
        }

        if (!inputData.name || !inputData.email || !emailRegex.test(inputData.email) || !inputData.age || !(0 < inputData.age && 60 >= inputData.age) || !inputData.mobile || !mobileRegex.test(inputData.mobile) || !inputData.address.addressLine1 || inputData.address.addressLine1.length > 200 || !inputData.address.addressLine2 || inputData.address.addressLine2.length > 200 || !inputData.address.city || inputData.address.city.length > 200 || !inputData.address.state || inputData.address.state.length > 200 || !inputData.address.country || inputData.address.country.length > 200 || !inputData.address.postalCode || inputData.address.postalCode.length > 200 || !role || !gender || !file) {
            return true;
        }
    };

    const handleChange = (e) => {
        if (e.target.name.startsWith("address.")) {
            const addressField = e.target.name.split('.')[1];
            setInputData({
                ...inputData, address: { ...inputData.address, [addressField]: e.target.value, }
            });
        } else {
            setInputData({ ...inputData, [e.target.name]: e.target.value })
        }
    }

    const registerData = async (e) => {
        e.preventDefault();
        if (await validation()) {
            return;
        }

        const id = localStorage.getItem('id');
        const formData = new FormData();
        formData.append('avatar', file);
        formData.append('name', inputData.name);
        formData.append('address', JSON.stringify(inputData.address));
        formData.append('email', inputData.email);
        formData.append('password', inputData.password);
        formData.append('age', inputData.age);
        formData.append('mobile', inputData.mobile);
        formData.append('roles', role);
        formData.append('gender', gender);
        formData.append('managerId', id);
        formData.append('createdBy', id);
        formData.append('updatedBy', id);

        try {
            await authService.register(formData, jwtToken);
            setTimeout(function () {
                const toastOptions = configureToastOptions();
                toast.options = toastOptions;
                toast.success(messages.register.success.employeeRegistered);
            });
            navigate('/home');
        } catch (error) {
            const toastOptions = configureToastOptions();
            toast.options = toastOptions;
            toast.error(error);
        }
    }

    return (
        <>
            <Layout></Layout>
            <div class="container py-5">
                <div class="row justify-content-center">
                    <div class="col-lg-10">
                        <div class="card mb-6">
                            <div class="card-body">
                                <form action="#" method="post" enctype="multipart/form-data" onSubmit={registerData}>
                                    <div class="row mb-3">
                                        <div class="col-md-6">
                                            <br></br>
                                            <label class="form-label font-weight-bold">Full Name:</label>
                                            <input type="text" class="form-control" id="name" name="name" onChange={handleChange} placeholder="enter full name" />
                                            {error.name && <p className="errorColor">{error.name}</p>}
                                        </div>
                                        <div class="col-md-6">
                                            <br></br>
                                            <label class="form-label font-weight-bold">Email:</label>
                                            <input type="text" class="form-control" id="email" name="email" onChange={handleChange} placeholder="enter email address" />
                                            {error.email && <p className="errorColor">{error.email}</p>}
                                            <p className="errorColor">{emailMessage}</p>
                                        </div>
                                    </div>
                                    <br></br>
                                    <div class="row mb-3">
                                        <div class="col-md-6">
                                            <label class="form-label font-weight-bold">Password:</label>
                                            <input type="password" class="form-control" id="password" name="password" onChange={handleChange} placeholder="enter password" />
                                            {error.password && <p className="errorColor">{error.password}</p>}
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label font-weight-bold">Age:</label>
                                            <input type="number" class="form-control" id="age" name="age" onChange={handleChange} placeholder="enter your age" />
                                            {error.age && <p className="errorColor">{error.age}</p>}
                                        </div>
                                    </div>
                                    <br></br>
                                    <div class="row mb-3">
                                        <div class="col-md-6">
                                            <label class="form-label font-weight-bold">Mobile:</label>
                                            <input type="tel" class="form-control" id="mobile" name="mobile" onChange={handleChange} placeholder="enter mobile number" />
                                            {error.mobile && <p className="errorColor">{error.mobile}</p>}
                                        </div>
                                        <div class="col-md-6">
                                            <br></br>
                                            <label class="form-label font-weight-bold">Role:</label>
                                            <select class="form-select" id="role"
                                                name="role"
                                                required
                                                value={role} onChange={(e) => setRole(e.target.value)} >
                                                <option>select role</option>
                                                <option value="658eac73510f63f754e68cf9">Employee</option>
                                            </select>
                                            {error.role && <p className="errorColor">{error.role}</p>}
                                        </div>
                                    </div>
                                    <br></br>
                                    <div class="row mb-3">
                                        <div class="col-md-6">
                                            <label class="form-label font-weight-bold">Address:</label>
                                            <br></br>
                                            <label class="form-label">address Line 1:</label>
                                            <input type="text" class="form-control" id="name" name="address.addressLine1" onChange={handleChange} />
                                            {error.addressLine1 && <p className="errorColor">{error.addressLine1}</p>}
                                            <label class="form-label">address Line 2:</label>
                                            <input type="text" class="form-control" id="name" name="address.addressLine2" onChange={handleChange} />
                                            {error.addressLine2 && <p className="errorColor">{error.addressLine2}</p>}
                                            <label class="form-label">city:</label>
                                            <input type="text" class="form-control" id="name" name="address.city" onChange={handleChange} />
                                            {error.city && <p className="errorColor">{error.city}</p>}
                                            <label class="form-label">state:</label>
                                            <input type="text" class="form-control" id="name" name="address.state" onChange={handleChange} />
                                            {error.state && <p className="errorColor">{error.state}</p>}
                                            <label class="form-label">country:</label>
                                            <input type="text" class="form-control" id="name" name="address.country" onChange={handleChange} />
                                            {error.country && <p className="errorColor">{error.country}</p>}
                                            <label class="form-label">postal code:</label>
                                            <input type="text" class="form-control" id="name" name="address.postalCode" onChange={handleChange} />
                                            {error.postalCode && <p className="errorColor">{error.postalCode}</p>}
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label font-weight-bold">Gender:</label>
                                            <select class="form-select" id="gender"
                                                name="gender"
                                                required
                                                value={gender} onChange={(e) => setGender(e.target.value)} >
                                                <option>select Gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                            </select>
                                            {error.gender && <p className="errorColor">{error.gender}</p>}
                                            <br></br>
                                            <label class="form-label font-weight-bold">Upload Image:</label>
                                            <input type="file" class="form-control" id="file" name="avatar" onChange={handleFileChange} />
                                            {error.file && <p className="errorColor">{error.file}</p>}
                                        </div>
                                    </div>
                                    <button type="submit" class="btn btn-primary">Submit</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Register;