import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import messages from "../core/constants/messages";
import auth from "../core/services/auth-service";
import { useFormik } from "formik";
import { configureToastOptions } from "../core/services/toast-service";
import { setPasswordSchema } from "../core/validations/validations";

function SetPassword() {
    const [inputData, setInputData] = useState({
        password: '',
        confirmPassword: ''
    })
    const id = localStorage.getItem("id");

    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
        initialValues: inputData,
        validationSchema: setPasswordSchema,
        onSubmit: async (values) => {
            try {
                await auth.setPassword(values, id);
                setTimeout(function () {
                    const toastOptions = configureToastOptions();
                    toast.options = toastOptions;
                    toast.success(messages.setPassword.success.passwordChanged);
                });
            } catch (error) {
                const toastOptions = configureToastOptions();
                toast.options = toastOptions;
                toast.error(error);
            }
        }
    })

    return (<>
        <center>
            <div class="card text-center forgotPassword">
                <div class="card-header h5 text-white bg-primary gradient-custom-2">Password Reset</div>
                <div class="card-body px-5">
                    <form action="#" method="post" onSubmit={handleSubmit}>
                        <div class="mb-3">
                            <div className="text-start">
                                <label for="password" class="form-label font-weight-bold">New Password:</label>
                            </div>
                            <input type="password" class="form-control" id="password" name="password" placeholder="Enter new password" onChange={handleChange} value={values.password} onBlur={handleBlur} />
                            {errors.password && touched.password ? <p className='errorColor text-start'>{errors.password}</p> : null}
                        </div>
                        <div class="mb-3">
                            <div className="text-start">
                                <label for="password" class="form-label font-weight-bold">Confirm Password:</label>
                            </div>
                            <input type="password" class="form-control" id="confirmPassword" name="confirmPassword" placeholder="Enter confirm password" onChange={handleChange} value={values.confirmPassword} onBlur={handleBlur} />
                            {errors.confirmPassword && touched.confirmPassword ? <p className='errorColor text-start'>{errors.confirmPassword}</p> : null}
                        </div>
                        <button type="submit" class="btn btn-primary w-100 gradient-custom-2 my-2">Change Password</button>
                    </form>
                    <div class="d-flex justify-content-between mt-4">
                        <Link to="/login">Back to login</Link>
                    </div>
                </div>
            </div>
        </center>
    </>
    )
}

export default SetPassword;