import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./layout";
import messages from "../core/constants/messages";
import mobileRegex from "../core/constants/mobile-regex";
import emailRegex from "../core/constants/email-regex";
import passwordRegex from "../core/constants/password-regex";
import { configureToastOptions } from "../core/services/toast-service";
import authService from "../core/services/auth-service";
import decodeJwt from "../core/services/decodedJwtData-service";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import EmployeeLayout from './employeeLayout';
import AdminLayout from './adminLayout';

function Register() {
    const navigate = useNavigate();
    const [inputData, setInputData] = useState({
        email: '',
        password: '',
        name: '',
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
    const [leaveId, setLeaveId] = useState(["659bc36c01e2f1640c26260e", "659bc3ae01e2f1640c262612", "659bc3b501e2f1640c262614", "659bc3c101e2f1640c262616", "659bc3c601e2f1640c262618", "659bc3ce01e2f1640c26261a"])
    const adminId = decodeJwt().id;
    const [dob, setDob] = useState(null);
    const [respondingTo, setRespondingTo] = useState([]);
    const [managerId, setManagerId] = useState('');
    const [isFileImage, setIsFileImage] = useState(true);
    const jwtToken = localStorage.getItem('authToken');

    useEffect(() => {
        if (respondingTo.length === 1) {
            setManagerId(respondingTo[0]._id);
        }
    }, [respondingTo]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const fileType = selectedFile.type.split('/')[0];
            if (fileType === 'image') {
                setIsFileImage(true);

            } else {
                setIsFileImage(false);
            }
        }
        setFile(selectedFile);

    }

    const checkEmail = async () => {
        try {
            await authService.varifyEmail({ email: inputData.email }, jwtToken);
            setEmailMessage(messages.register.error.emailAlreadyExist);
            return true;
        } catch (error) {
            setEmailMessage('');
        }
    }

    const calculateAge = (dob) => {
        if (!dob) return null;
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

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

        if (!dob) {
            error.dob = messages.register.error.DobRequired;
        } else if (calculateAge(dob) < 18) {
            error.dob = messages.register.error.ageValidation;
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

        if (!managerId) {
            error.respondingTo = messages.register.error.respondingToRequired;
        }

        if (!gender) {
            error.gender = messages.register.error.genderRequired;
        }

        if (!file) {
            error.file = messages.register.error.imageRequired;
        } else if (isFileImage === false) {
            error.file = messages.register.error.fileValidation;
        }

        setError(error);
        if (await checkEmail()) {
            return true;
        }

        if (!inputData.name || !inputData.email || !emailRegex.test(inputData.email) || !inputData.mobile || !mobileRegex.test(inputData.mobile) || !inputData.address.addressLine1 || inputData.address.addressLine1.length > 200 || !inputData.address.addressLine2 || inputData.address.addressLine2.length > 200 || !inputData.address.city || inputData.address.city.length > 200 || !inputData.address.state || inputData.address.state.length > 200 || !inputData.address.country || inputData.address.country.length > 200 || !inputData.address.postalCode || inputData.address.postalCode.length > 200 || !role || !gender || !file || !dob || !managerId || calculateAge(dob) < 18 || isFileImage === false) {
            return true;
        }
    };

    const handleChange = (e) => {
        if (e.target.name.startsWith("address.")) {
            const addressField = e.target.name.split('.')[1];
            setInputData({
                ...inputData,
                address: {
                    ...inputData.address,
                    [addressField]: e.target.value,
                }
            });
        } else {
            setInputData({ ...inputData, [e.target.name]: e.target.value });
        }
    }

    const registerData = async (e) => {
        e.preventDefault();
        if (await validation()) {
            return;
        }

        const formData = new FormData();
        formData.append('avatar', file);
        formData.append('name', inputData.name);
        formData.append('address', JSON.stringify(inputData.address));
        formData.append('email', inputData.email);
        formData.append('password', inputData.password);
        formData.append('dateOfBirth', dob);
        formData.append('mobile', inputData.mobile);
        formData.append('roles', role);
        formData.append('gender', gender);
        formData.append('managerId', managerId);
        formData.append('createdBy', adminId);
        formData.append('updatedBy', adminId);

        try {
            const result = await authService.register(formData, jwtToken);
            const userId = result.data._id;

            const leaveRecords = leaveId.map(async (id) => {
                if (id === "659bc3c101e2f1640c262616") {
                    return {
                        userId: userId,
                        leaveId: id,
                        balance: 1.5,
                        createdBy: adminId,
                        updatedBy: adminId
                    };
                } else {
                    if (id === "659bc3ce01e2f1640c26261a") {
                        return {
                            userId: userId,
                            leaveId: id,
                            balance: 3,
                            createdBy: adminId,
                            updatedBy: adminId
                        };
                    } else {
                        return {
                            userId: userId,
                            leaveId: id,
                            balance: 0,
                            createdBy: adminId,
                            updatedBy: adminId
                        };
                    }
                }
            });

            const leaveRecordsData = await Promise.all(leaveRecords);
            await Promise.all(leaveRecordsData.map(record => authService.createLeaveRecord(record)));

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

    const respondingToList = async (e) => {
        try {
            const selectedRole = e.target.value;
            setRole(selectedRole);

            if (selectedRole === '658eac73510f63f754e68cf9') {
                const result = await authService.getByRole('658eac9e510f63f754e68cfe', jwtToken);
                setRespondingTo(result.data);
            } else {
                if (selectedRole === '658eac9e510f63f754e68cfe') {
                    const result = await authService.getByRole('658eacbb510f63f754e68d02', jwtToken);
                    setRespondingTo(result.data);
                }
                else {
                    setRespondingTo([]);
                }
            }

        } catch (error) {
            const toastOptions = configureToastOptions();
            toast.options = toastOptions;
            toast.error(error);
        }
    };

    return (
        <>
            {decodeJwt().role === 'Employee' ? (
                <EmployeeLayout />
            ) : decodeJwt().role === 'Manager' ? (
                <Layout />
            ) : (
                <AdminLayout />
            )}
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
                                            <input type="text" class="form-control" id="name" name="name" onChange={handleChange} placeholder="Enter full name" />
                                            {error.name && <p className='errorColor'>{error.name}</p>}
                                        </div>
                                        <div class="col-md-6">
                                            <br></br>
                                            <label class="form-label font-weight-bold">Email:</label>
                                            <input type="text" class="form-control" id="email" name="email" onChange={handleChange} placeholder="Enter email address" />
                                            {error.email && <p className='errorColor'>{error.email}</p>}
                                            <p className='errorColor'>{emailMessage}</p>
                                        </div>
                                    </div>
                                    <br></br>
                                    <div class="row mb-3">
                                        <div class="col-md-6">
                                            <label class="form-label font-weight-bold">Password:</label>
                                            <input type="password" class="form-control" id="password" name="password" onChange={handleChange} placeholder="Enter password" />
                                            {error.password && <p className='errorColor'>{error.password}</p>}
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label font-weight-bold">Date Of Birth:</label>
                                            <div style={{ width: '100%' }}>
                                                <DatePicker
                                                    className="form-control"
                                                    selected={dob}
                                                    onChange={(date) => {
                                                        setDob(date);
                                                    }}
                                                    dateFormat="MM/dd/yyyy"
                                                    placeholderText="Select date of birth"
                                                    showYearDropdown
                                                    scrollableYearDropdown
                                                    yearDropdownItemNumber={40}
                                                    maxDate={new Date()}
                                                />
                                                {error.dob && <p className='errorColor'>{error.dob}</p>}
                                            </div>
                                        </div>
                                    </div>
                                    <br></br>
                                    <div class="row mb-3">
                                        <div class="col-md-6">
                                            <label class="form-label font-weight-bold">Mobile:</label>
                                            <input type="tel" class="form-control" id="mobile" name="mobile" onChange={handleChange} placeholder="Enter mobile number" />
                                            {error.mobile && <p className='errorColor'>{error.mobile}</p>}
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label font-weight-bold">Gender:</label>
                                            <select class="form-select" id="gender"
                                                name="gender"
                                                required
                                                value={gender} onChange={(e) => setGender(e.target.value)} >
                                                <option>Select gender</option>
                                                <option value={0}>Male</option>
                                                <option value={1}>Female</option>
                                            </select>
                                            {error.gender && <p className='errorColor'>{error.gender}</p>}
                                        </div>
                                    </div>
                                    <br></br>
                                    <div class="row mb-3">
                                        <div class="col-md-6">
                                            <label class="form-label font-weight-bold">Role:</label>
                                            <select class="form-select" id="role"
                                                name="role"
                                                required
                                                value={role} onChange={async (e) => await respondingToList(e)} >
                                                <option>Select role</option>
                                                <option value="658eac73510f63f754e68cf9">Employee</option>
                                                <option value="658eac9e510f63f754e68cfe">Manager</option>
                                            </select>
                                            {error.role && <p className='errorColor'>{error.role}</p>}
                                            <br></br><br></br>
                                            <label class="form-label font-weight-bold">Upload Image:</label>
                                            <input type="file" class="form-control" id="file" name="avatar" accept="image/png, image/gif, image/jpeg" onChange={handleFileChange} />
                                            {error.file && <p className='errorColor'>{error.file}</p>}
                                            <br></br>
                                            <hr className='registerLine' />
                                            <label class="form-label font-weight-bold">Address:</label>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label font-weight-bold">Reporting To:</label>
                                            {respondingTo.length !== 1 ? (
                                                <select
                                                    className="form-select"
                                                    id="respondingTo"
                                                    name="respondingTo"
                                                    required
                                                    value={managerId}
                                                    onChange={(e) => setManagerId(e.target.value)}
                                                    disabled={!role}
                                                >
                                                    <option>Select user</option>
                                                    {respondingTo.map((user) => (
                                                        <option key={user._id} value={user._id}>
                                                            {user.employeeId}-{user.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <select
                                                    className="form-select"
                                                    id="respondingTo"
                                                    name="respondingTo"
                                                    required
                                                    value={respondingTo[0]._id}
                                                    onChange={(e) => { setManagerId(respondingTo[0]._id) }
                                                    }
                                                    disabled
                                                >
                                                    <option value={respondingTo[0]._id}>
                                                        {respondingTo[0].employeeId}-{respondingTo[0].name}
                                                    </option>
                                                </select>
                                            )}
                                            {error.respondingTo && <p className='errorColor'>{error.respondingTo}</p>}
                                        </div>
                                        <div class="row mb-3">
                                            <div class="col-md-6">
                                                <br></br>
                                                <label class="form-label">Address Line 1:</label>
                                                <input type="text" class="form-control" id="name" name="address.addressLine1" onChange={handleChange} placeholder='Enter address line 1' />
                                                {error.addressLine1 && <p className='errorColor'>{error.addressLine1}</p>}
                                            </div>
                                            <div class="col-md-6">
                                                <br></br>
                                                <label class="form-label">Address Line 2:</label>
                                                <input type="text" class="form-control" id="name" name="address.addressLine2" onChange={handleChange} placeholder='Enter address line 2' />
                                                {error.addressLine2 && <p className='errorColor'>{error.addressLine2}</p>}
                                            </div>
                                        </div>
                                        <div class="row mb-3">
                                            <div class="col-md-6">
                                                <br></br>
                                                <label class="form-label">City:</label>
                                                <input type="text" class="form-control" id="name" name="address.city" onChange={handleChange} placeholder='Enter city name' />
                                                {error.city && <p className='errorColor'>{error.city}</p>}
                                            </div>
                                            <div class="col-md-6">
                                                <br></br>
                                                <label class="form-label">State:</label>
                                                <input type="text" class="form-control" id="name" name="address.state" onChange={handleChange} placeholder='Enter state name' />
                                                {error.state && <p className='errorColor'>{error.state}</p>}
                                            </div>
                                        </div>
                                        <div class="row mb-3">
                                            <div class="col-md-6">
                                                <br></br>
                                                <label class="form-label">Country:</label>
                                                <input type="text" class="form-control" id="name" name="address.country" onChange={handleChange} placeholder='Enter country name' />
                                                {error.country && <p className='errorColor'>{error.country}</p>}
                                            </div>
                                            <div class="col-md-6">
                                                <br></br>
                                                <label class="form-label">Postal code:</label>
                                                <input type="text" class="form-control" id="name" name="address.postalCode" onChange={handleChange} placeholder='Enter postal code' />
                                                {error.postalCode && <p className='errorColor'>{error.postalCode}</p>}
                                            </div>
                                        </div>
                                    </div>
                                    <button type="submit" class="btn btn-dark">Submit</button>
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