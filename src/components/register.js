import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import messages from "../core/constants/messages";
import { configureToastOptions } from "../core/services/toast-service";
import authService from "../core/services/auth-service";
import decodeJwt from "../core/services/decodedJwtData-service";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useFormik } from "formik";
import { registerSchema } from '../core/validations/validations';

function Register() {
    const navigate = useNavigate();
    const [inputData, setInputData] = useState({
        email: '',
        password: '',
        name: '',
        mobile: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
        managerId: '',
        role: '',
        gender: '',
        dob: null,
    })
    const [file, setFile] = useState(null);
    const [error, setError] = useState({email:'',age:'',file:''});
    const [leaveId, setLeaveId] = useState(["659bc36c01e2f1640c26260e", "659bc3ae01e2f1640c262612", "659bc3b501e2f1640c262614", "659bc3c101e2f1640c262616", "659bc3c601e2f1640c262618", "659bc3ce01e2f1640c26261a"])
    const adminId = decodeJwt().id;
    const [respondingTo, setRespondingTo] = useState([]);
    const [isFileImage, setIsFileImage] = useState(true);

    useEffect(() => {
        if (respondingTo.length === 1) {
            setFieldValue('managerId',respondingTo[0]._id);
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
            await authService.varifyEmail({ email: values.email });
            setError({email:messages.register.error.emailAlreadyExist});
            return true;
        } catch (error) {
            setError({email:''});
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

    const { values, errors, touched, setFieldValue, handleBlur, handleChange, handleSubmit } = useFormik({
        initialValues: inputData,
        validationSchema: registerSchema,
        onSubmit: async (values) => {

            if(calculateAge(values.dob)<18){
                setError({age:messages.register.error.ageValidation}); 
                return
            }

            if(!file){
                if(isFileImage===false){
                    setError({file:messages.register.error.fileValidation})
                }else{
                    setError({file:messages.register.error.imageRequired})
                }
                return
            }

            if(await checkEmail()){
                return;
            }

            const address = {
                'addressLine1': values.addressLine1,
                'addressLine2': values.addressLine2,
                'city': values.city,
                'state': values.state,
                'country': values.country,
                'postalCode': values.postalCode,
            }

            const formData = new FormData();
            formData.append('avatar', file);
            formData.append('name', values.name);
            formData.append('address', address);
            formData.append('email', values.email);
            formData.append('password', values.password);
            formData.append('dateOfBirth', values.dob);
            formData.append('mobile', values.mobile);
            formData.append('roles', values.role);
            formData.append('gender', values.gender);
            formData.append('managerId', values.managerId);
            formData.append('createdBy', adminId);
            formData.append('updatedBy', adminId);

            try {
                const result = await authService.register(formData);
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
    })

    const respondingToList = async (e) => {
        try {
            const selectedRole = e.target.value;
            setFieldValue('role',selectedRole);

            if (selectedRole === '658eac73510f63f754e68cf9') {
                const result = await authService.getByRole('658eac9e510f63f754e68cfe');
                setRespondingTo(result.data);
            } else {
                if (selectedRole === '658eac9e510f63f754e68cfe') {
                    const result = await authService.getByRole('658eacbb510f63f754e68d02');
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
            <div class="container py-5">
                <div class="row justify-content-center">
                    <div class="col-lg-10">
                        <div class="card mb-6">
                            <div class="card-body">
                                <form action="#" method="post" enctype="multipart/form-data" onSubmit={handleSubmit}>
                                    <div class="row mb-3">
                                        <div class="col-md-6 mb-3">
                                            <label class="form-label font-weight-bold">Full Name:</label>
                                            <input type="text" class="form-control" id="name" name="name" onChange={handleChange} value={values.name} onBlur={handleBlur} placeholder="Enter full name" />
                                            {errors.name && touched.name ? <p className='errorColor'>{errors.name}</p> : null}
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <label class="form-label font-weight-bold">Email:</label>
                                            <input type="text" class="form-control" id="email" name="email" onChange={handleChange} value={values.email} onBlur={handleBlur} placeholder="Enter email address" />
                                            {errors.email && touched.email ? <p className='errorColor'>{errors.email}</p> : null}
                                            {error.email && <p className='errorColor'>{error.email}</p>}
                                        </div>
                                    </div>
                                    <div class="row mb-3">
                                        <div class="col-md-6 mb-3">
                                            <label class="form-label font-weight-bold">Password:</label>
                                            <input type="password" class="form-control" id="password" name="password" onChange={handleChange} value={values.password} onBlur={handleBlur} placeholder="Enter password" />
                                            {errors.password && touched.password ? <p className='errorColor'>{errors.password}</p> : null}
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <label class="form-label font-weight-bold">Date Of Birth:</label>
                                            <div className='w-100'>
                                                <DatePicker
                                                    className="form-control"
                                                    selected={values.dob}
                                                    onChange={(date) => {
                                                        setFieldValue('dob', date);
                                                    }}
                                                    dateFormat="MM/dd/yyyy"
                                                    placeholderText="Select date of birth"
                                                    showYearDropdown
                                                    scrollableYearDropdown
                                                    yearDropdownItemNumber={40}
                                                    maxDate={new Date()}
                                                    onBlur={handleBlur}
                                                />
                                                {errors.dob && touched.dob ? <p className='errorColor'>{errors.dob}</p> : null}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row mb-3">
                                        <div class="col-md-6 mb-3">
                                            <label class="form-label font-weight-bold">Mobile:</label>
                                            <input type="tel" class="form-control" id="mobile" name="mobile" onChange={handleChange} value={values.mobile} onBlur={handleBlur} placeholder="Enter mobile number" />
                                            {errors.mobile && touched.mobile ? <p className='errorColor'>{errors.mobile}</p> : null}
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <label class="form-label font-weight-bold">Gender:</label>
                                            <select class="form-select" id="gender"
                                                name="gender"
                                                value={values.gender} onBlur={handleBlur} onChange={(e) => setFieldValue('gender',e.target.value)} >
                                                <option>Select gender</option>
                                                <option value={0}>Male</option>
                                                <option value={1}>Female</option>
                                            </select>
                                            {errors.gender && touched.gender ? <p className='errorColor'>{errors.gender}</p> : null}
                                        </div>
                                    </div>
                                    <div class="row mb-3">
                                        <div class="col-md-6 mb-3">
                                            <label class="form-label font-weight-bold">Role:</label>
                                            <select class="form-select" id="role"
                                                name="role"
                                                value={values.role} onBlur={handleBlur} onChange={async (e) => await respondingToList(e)} >
                                                <option>Select role</option>
                                                <option value="658eac73510f63f754e68cf9">Employee</option>
                                                <option value="658eac9e510f63f754e68cfe">Manager</option>
                                            </select>
                                            {errors.role && touched.role ? <p className='errorColor'>{errors.role}</p> : null}
                                            <label class="form-label font-weight-bold mt-3">Upload Image:</label>
                                            <input type="file" class="form-control" id="file" name="avatar" accept="image/png, image/gif, image/jpeg" onChange={handleFileChange} />
                                            {error.file && <p className='errorColor'>{error.file}</p>}
                                            <hr className='registerLine' />
                                            <label class="form-label font-weight-bold">Address:</label>
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <label class="form-label font-weight-bold">Reporting To:</label>
                                            {respondingTo.length !== 1 ? (
                                                <select
                                                    className="form-select"
                                                    id="respondingTo"
                                                    name="respondingTo"
                                                    value={values.managerId}
                                                    onChange={(e) => setFieldValue('managerId',e.target.value)}
                                                    onBlur={handleBlur}
                                                    disabled={!values.role}
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
                                                    value={values.managerId}
                                                    onChange={() => { setFieldValue('managerId',respondingTo[0]._id) }}
                                                    onBlur={handleBlur}
                                                    disabled
                                                >
                                                    <option value={respondingTo[0]._id}>
                                                        {respondingTo[0].employeeId}-{respondingTo[0].name}
                                                    </option>
                                                </select>
                                            )}
                                            {errors.managerId && touched.managerId ? <p className='errorColor'>{errors.managerId}</p> : null}
                                        </div>
                                        <div class="row mb-3">
                                            <div class="col-md-6 mb-3">
                                                <label class="form-label">Address Line 1:</label>
                                                <input type="text" class="form-control" id="name" name="addressLine1" onChange={handleChange} value={values.addressLine1} onBlur={handleBlur} placeholder='Enter address line 1' />
                                                {errors.addressLine1 && touched.addressLine1 ? <p className='errorColor'>{errors.addressLine1}</p> : null}
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <label class="form-label">Address Line 2:</label>
                                                <input type="text" class="form-control" id="name" name="addressLine2" onChange={handleChange} value={values.addressLine2} onBlur={handleBlur} placeholder='Enter address line 2' />
                                                {errors.addressLine2 && touched.addressLine2 ? <p className='errorColor'>{errors.addressLine2}</p> : null}
                                            </div>
                                        </div>
                                        <div class="row mb-3">
                                            <div class="col-md-6 mb-3">
                                                <label class="form-label">City:</label>
                                                <input type="text" class="form-control" id="name" name="city" onChange={handleChange} value={values.city} onBlur={handleBlur} placeholder='Enter city name' />
                                                {errors.city && touched.city ? <p className='errorColor'>{errors.city}</p> : null}
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <label class="form-label">State:</label>
                                                <input type="text" class="form-control" id="name" name="state" onChange={handleChange} value={values.state} onBlur={handleBlur} placeholder='Enter state name' />
                                                {errors.state && touched.state ? <p className='errorColor'>{errors.state}</p> : null}
                                            </div>
                                        </div>
                                        <div class="row mb-3">
                                            <div class="col-md-6 mb-3">
                                                <label class="form-label">Country:</label>
                                                <input type="text" class="form-control" id="name" name="country" onChange={handleChange} value={values.country} onBlur={handleBlur} placeholder='Enter country name' />
                                                {errors.country && touched.country ? <p className='errorColor'>{errors.country}</p> : null}
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <label class="form-label">Postal code:</label>
                                                <input type="text" class="form-control" id="name" name="postalCode" onChange={handleChange} value={values.postalCode} onBlur={handleBlur} placeholder='Enter postal code' />
                                                {errors.postalCode && touched.postalCode ? <p className='errorColor'>{errors.postalCode}</p> : null}
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