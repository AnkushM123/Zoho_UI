import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import emailRegex from '../core/constants/email-regex';
import messages from "../core/constants/messages";
import auth from "../core/services/auth-service";
import { configureToastOptions } from "../core/services/toast-service";

function VarifyEmail() {
    const navigate = useNavigate();
    const [inputData, setInputData] = useState({
        email: ''
    })
    const [error, setError] = useState('');

    const validateEmail = () => {
        const error = {};
        if (!inputData.email.trim()) {
            error.email = messages.varifyEmail.error.emailRequired;
        } else if (!emailRegex.test(inputData.email)) {
            error.email = messages.varifyEmail.error.invalidEmail;
        }
        setError(error);
        if (!inputData.email.trim() || !emailRegex.test(inputData.email)) {
            return true;
        }
    };

    const handleChange = (e) => {
        setInputData({ ...inputData, [e.target.name]: e.target.value });
    }

    const varifyEmail = async (e) => {
        e.preventDefault();
        if (validateEmail()) {
            return;
        }

        try {
            const result = await auth.varifyEmail(inputData);
            localStorage.setItem("id", result.data[0]._id);
            navigate('/setPassword');
        } catch (error) {
            const toastOptions = configureToastOptions();
            toast.options = toastOptions;
            toast.error(messages.varifyEmail.error.emailNotExist);
        }
    }

    return (
        <>
            <center>
                <div class="card forgotPassword" >
                    <div class="card-header h5 text-white bg-primary gradient-custom-2">Email Varification</div>
                    <div class="card-body px-5">
                        <p class="card-text py-2">
                            Enter your email address to varify user.
                        </p>
                        <form action="#" method="post" onSubmit={varifyEmail}>
                            <div class="form-outline">
                                <div className="text-start">
                                    <label class="form-label font-weight-bold">Email input:</label>
                                </div>
                                <input type="text" id="typeEmail" class="form-control my-3" name="email" placeholder="Enter email address" onChange={handleChange} />
                                {error.email && <p class="form-label font-weight-bold errorColor">{error.email}</p>}
                            </div>
                            <br></br>
                            <button type="submit" class="btn btn-primary w-100 gradient-custom-2">Varify</button>
                        </form>
                        <div class="d-flex justify-content-between mt-4">
                            <Link to="/">Login</Link>
                        </div>
                    </div>
                </div>
            </center>
        </>
    )
}

export default VarifyEmail;