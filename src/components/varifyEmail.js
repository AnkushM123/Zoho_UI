import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import messages from "../core/constants/messages";
import auth from "../core/services/auth-service";
import { useFormik } from "formik";
import { configureToastOptions } from "../core/services/toast-service";
import { varifyEmailSchema } from "../core/validations/validations";

function VarifyEmail() {
    const navigate = useNavigate();
    const [inputData, setInputData] = useState({
        email: ''
    })

    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
        initialValues: inputData,
        validationSchema: varifyEmailSchema,
        onSubmit: async (values) => {
            try {
                const result = await auth.varifyEmail(values);
                localStorage.setItem("id", result.data[0]._id);
                navigate('/setPassword');
            } catch (error) {
                const toastOptions = configureToastOptions();
                toast.options = toastOptions;
                toast.error(messages.varifyEmail.error.emailNotExist);
            }
        }
    })

    return (
        <>
            <center>
                <div class="card forgotPassword" >
                    <div class="card-header h5 text-white bg-primary gradient-custom-2">Email Varification</div>
                    <div class="card-body px-5">
                        <p class="card-text py-2">
                            Enter your email address to varify user.
                        </p>
                        <form action="#" method="post" onSubmit={handleSubmit}>
                            <div class="form-outline mb-3">
                                <div className="text-start">
                                    <label class="form-label font-weight-bold">Email input:</label>
                                </div>
                                <input type="text" id="email" class="form-control" name="email" placeholder="Enter email address" onChange={handleChange} value={values.email} onBlur={handleBlur} />
                                {errors.email && touched.email ? <p className='errorColor text-start'>{errors.email}</p> : null}
                            </div>
                            <button type="submit" class="btn btn-primary w-100 gradient-custom-2 my-2">Varify</button>
                        </form>
                        <div class="d-flex justify-content-between mt-4">
                            <Link to="/login">Login</Link>
                        </div>
                    </div>
                </div>
            </center>
        </>
    )
}

export default VarifyEmail;