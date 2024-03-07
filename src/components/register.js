import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import messages from "../core/constants/messages";
import { configureToastOptions } from "../core/services/toast-service";
import authService from "../core/services/auth-service";
import { useFormik } from "formik";
import { registerSchema } from '../core/validations/validations';

function Register() {
    const navigate = useNavigate();
    const [inputData, setInputData] = useState({
        email: '',
        password: '',
        name: '',
        age: '',
        mobile: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
        role: '',
        gender: 0
    })
    const [file, setFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState({ email: '', file: '' })
    const jwtToken = localStorage.getItem('authToken');

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
            setErrorMessage({ file: '' });
        }
        else
            setErrorMessage({ file: messages.register.error.imageRequired });
    };

    const checkEmail = async (email) => {
        try {
            await authService.varifyEmail({ email: email });
            setErrorMessage({ email: messages.register.error.emailAlreadyExist });
            return true;
        } catch (error) {
            setErrorMessage({ email: '' });
            const toastOptions = configureToastOptions();
            toast.options = toastOptions;
            toast.error(messages.login.error.toastError);
        }
    }

    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
        initialValues: inputData,
        validationSchema: registerSchema,
        onSubmit: async (values) => {
            try {
                if (!file && await checkEmail(values.email)) {
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

                const id = localStorage.getItem('id');
                const formData = new FormData();
                formData.append('avatar', file);
                formData.append('name', values.name);
                formData.append('address', JSON.stringify(address));
                formData.append('email', values.email);
                formData.append('password', values.password);
                formData.append('age', values.age);
                formData.append('mobile', values.mobile);
                formData.append('roles', values.role);
                formData.append('gender', values.gender);
                formData.append('managerId', id);
                formData.append('createdBy', id);
                formData.append('updatedBy', id);

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
    })

    return (
        <>
            <div class="container py-5">
                <div class="row justify-content-center">
                    <div class="col-lg-10">
                        <div class="card mb-6">
                            <div class="card-body">
                                <form action="#" method="post" enctype="multipart/form-data" onSubmit={handleSubmit}>
                                    <div class="row mb-3">
                                        <div class="col-md-6 my-2">
                                            <label class="form-label font-weight-bold">Full Name:</label>
                                            <input type="text" class="form-control" id="name" name="name" onChange={handleChange} value={values.name} onBlur={handleBlur} placeholder="enter full name" />
                                            {errors.name && touched.name ? <p className='errorColor'>{errors.name}</p> : null}
                                        </div>
                                        <div class="col-md-6 my-2">
                                            <label class="form-label font-weight-bold">Email:</label>
                                            <input type="text" class="form-control" id="email" name="email" onChange={handleChange} value={values.email} onBlur={handleBlur} placeholder="enter email address" />
                                            {errors.email && touched.email ? <p className='errorColor'>{errors.email}</p> : null}
                                            <p className="errorColor">{errorMessage.email}</p>
                                        </div>
                                    </div>
                                    <div class="row mb-3">
                                        <div class="col-md-6 my-2">
                                            <label class="form-label font-weight-bold">Password:</label>
                                            <input type="password" class="form-control" id="password" name="password" onChange={handleChange} value={values.password} onBlur={handleBlur} placeholder="enter password" />
                                            {errors.password && touched.password ? <p className='errorColor'>{errors.password}</p> : null}
                                        </div>
                                        <div class="col-md-6 my-2">
                                            <label class="form-label font-weight-bold">Age:</label>
                                            <input type="number" class="form-control" id="age" name="age" onChange={handleChange} value={values.age} onBlur={handleBlur} placeholder="enter your age" />
                                            {errors.age && touched.age ? <p className='errorColor'>{errors.age}</p> : null}
                                        </div>
                                    </div>
                                    <div class="row mb-3">
                                        <div class="col-md-6 my-2">
                                            <label class="form-label font-weight-bold">Mobile:</label>
                                            <input type="tel" class="form-control" id="mobile" name="mobile" onChange={handleChange} value={values.mobile} onBlur={handleBlur} placeholder="enter mobile number" />
                                            {errors.mobile && touched.mobile ? <p className='errorColor'>{errors.mobile}</p> : null}
                                        </div>
                                        <div class="col-md-6 my-2">
                                            <label class="form-label font-weight-bold">Role:</label>
                                            <select class="form-select" id="role"
                                                name="role"
                                                required
                                                onChange={handleChange} value={values.role} onBlur={handleBlur} >
                                                <option>select role</option>
                                                <option value="658eac73510f63f754e68cf9">Employee</option>
                                            </select>
                                            {errors.role && touched.role ? <p className='errorColor'>{errors.role}</p> : null}
                                        </div>
                                    </div>
                                    <div class="row mb-3">
                                        <label class="form-label font-weight-bold">Address:</label>
                                        <div class="col-md-6 my-2">
                                            <label class="form-label">address Line 1:</label>
                                            <input type="text" class="form-control" name="addressLine1" onChange={handleChange} value={values.addressLine1} onBlur={handleBlur} />
                                            {errors.addressLine1 && touched.addressLine1 ? <p className='errorColor'>{errors.addressLine1}</p> : null}
                                            <label class="form-label">address Line 2:</label>
                                            <input type="text" class="form-control" name="addressLine2" onChange={handleChange} value={values.addressLine2} onBlur={handleBlur} />
                                            {errors.addressLine2 && touched.addressLine2 ? <p className='errorColor'>{errors.addressLine2}</p> : null}
                                            <label class="form-label">city:</label>
                                            <input type="text" class="form-control" name="city" onChange={handleChange} value={values.city} onBlur={handleBlur} />
                                            {errors.city && touched.city ? <p className='errorColor'>{errors.city}</p> : null}
                                            <label class="form-label">state:</label>
                                            <input type="text" class="form-control" name="state" onChange={handleChange} value={values.state} onBlur={handleBlur} />
                                            {errors.state && touched.state ? <p className='errorColor'>{errors.state}</p> : null}
                                            <label class="form-label">country:</label>
                                            <input type="text" class="form-control" name="country" onChange={handleChange} value={values.country} onBlur={handleBlur} />
                                            {errors.country && touched.country ? <p className='errorColor'>{errors.country}</p> : null}
                                            <label class="form-label">postal code:</label>
                                            <input type="text" class="form-control" name="postalCode" onChange={handleChange} value={values.postalCode} onBlur={handleBlur} />
                                            {errors.postalCode && touched.postalCode ? <p className='errorColor'>{errors.postalCode}</p> : null}
                                        </div>
                                        <div class="col-md-6 my-2">
                                            <label class="form-label font-weight-bold">Gender:</label>
                                            <select class="form-select" id="gender"
                                                name="gender"
                                                required
                                                onChange={handleChange} value={values.gender} onBlur={handleBlur} >
                                                <option value={0}>Male</option>
                                                <option value={1}>Female</option>
                                            </select>
                                            {errors.gender && touched.gender ? <p className='errorColor'>{errors.gender}</p> : null}
                                            <label class="form-label font-weight-bold mt-3">Upload Image:</label>
                                            <input type="file" class="form-control" id="file" name="avatar" onChange={handleFileChange} />
                                            {errorMessage.file && <p className="errorColor">{errorMessage.file}</p>}
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