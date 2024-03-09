import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { configureToastOptions } from "../core/services/toast-service";
import messages from "../core/constants/messages";
import decodeJwt from "../core/services/decodedJwtData-service";
import changePasswordService from "../core/services/changePassword-service";
import { useFormik } from "formik";
import { changePasswordSchema } from "../core/validations/validations";

function ChangePassword() {
    const navigate = useNavigate();
    const id = decodeJwt().id;
    const [inputData, setInputData] = useState({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
    const [message, setMessage] = useState('');

    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
        initialValues: inputData,
        validationSchema: changePasswordSchema,
        onSubmit: async (values) => {
        try {
            const result= await changePasswordService(values, id);
            setMessage('');
            setTimeout(function () {
                const toastOptions = configureToastOptions();
                toast.options = toastOptions;
                toast.success(messages.changePassword.success.passwordChanged);
            });
            navigate('/');
        } catch (error) {
            setMessage(messages.changePassword.error.oldPasswordUnmatched);
            const toastOptions = configureToastOptions();
            toast.options = toastOptions;
            toast.error(error);
        }
    }})

    const navigateToProfile = () => {
        navigate('/profile');
    }

    return (
        <>
            <form action="#" method="post" onSubmit={handleSubmit}>
                <div class="container py-5">
                    <div class="row justify-content-center">
                        <div class="col-lg-8">
                            <div class="card mb-4">
                                <div class="card-body">
                                    <div className="row py-2">
                                        <div className="col-sm-3 mb-3">
                                            <p className="form-label font-weight-bold">Old Password:</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <input type="password" className="form-control" name="oldPassword" placeholder="Enter old password" onChange={handleChange} value={values.oldPassword} onBlur={handleBlur}/>
                                            {errors.oldPassword && touched.oldPassword ? <p className='errorColor'>{errors.oldPassword}</p> : null}
                                        </div>
                                    </div>
                                    <div className="row py-2">
                                        <div className="col-sm-3 mb-3">
                                            <p className="form-label font-weight-bold">New Password:</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <input type="password" className="form-control" name="newPassword" placeholder="Enter new password" onChange={handleChange} value={values.newPassword} onBlur={handleBlur}/>
                                            {errors.newPassword && touched.newPassword ? <p className='errorColor'>{errors.newPassword}</p> : null}
                                        </div>
                                    </div>
                                    <div className="row py-2">
                                        <div className="col-sm-3 mb-3">
                                            <p className="form-label font-weight-bold">Confirm New Password:</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <input type="password" className="form-control" name="confirmNewPassword" placeholder="Enter confirm new password" onChange={handleChange} value={values.confirmNewPassword} onBlur={handleBlur}/>
                                            {errors.confirmNewPassword && touched.confirmNewPassword ? <p className='errorColor'>{errors.confirmNewPassword}</p> : null}
                                        </div>
                                    </div>
                                    <button type="submit" class="btn btn-dark m-2">Submit</button>
                                    <button class="btn btn-dark" onClick={navigateToProfile}>Back</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <center>
                        {message && <p className="form-label font-weight-bold errorColor">{message}</p>}
                    </center>
                </div>
            </form>
        </>
    )
}

export default ChangePassword;