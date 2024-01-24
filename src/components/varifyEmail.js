import { Link, useNavigate } from "react-router-dom"
import { useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import emailRegex from '../core/constants/emailRegex';
import messages from "../core/constants/messages";
import varifyEmailService from "../core/services/varifyEmail-service";
import '../App.css';

function VarifyEmail() {
    const navigate = useNavigate();
    const [inputData, setInputData] = useState({
        email: ''
    })
    const [Error, setError] = useState('');

    const validateEmail = () => {
        const error = {};
        if (!inputData.email.trim()) {
            error.Email = messages.varifyEmailUi.emailRequired;
        } else if (!emailRegex.test(inputData.email)) {
            error.Email = messages.varifyEmailUi.invalidEmail;
        }
        setError(error);
    };

    const handleChange = (e) => {
        setInputData({ ...inputData, [e.target.name]: e.target.value });
    }

    const varifyEmail = async (e) => {
        e.preventDefault();
        validateEmail();

        if (!inputData.email.trim() || !emailRegex.test(inputData.email)) {
            return;
        }

        try {
            const result = await varifyEmailService(inputData);
            localStorage.setItem("id", result.data[0]._id);
            navigate('/setPassword');
        } catch (error) {
            toast.options = {
                closeButton: true,
                progressBar: true,
                showMethod: 'slideDown',
                timeOut: 500
            };
            toast.error(messages.varifyEmailUi.emailNotExist);
        }
    }

    return (
        <>
            <center>
                <div class="card text-center" style={{ width: "600px", marginTop: "60px" }}>
                    <div class="card-header h5 text-white bg-primary gradient-custom-2">Email Varification</div>
                    <div class="card-body px-5">
                        <p class="card-text py-2">
                            Enter your email address to varify user.
                        </p>
                        <form action="#" method="post" onSubmit={varifyEmail}>
                            <div class="form-outline">
                                <label class="form-label font-weight-bold" style={{ marginRight: "340px" }}>Email input:</label>
                                <input type="text" id="typeEmail" class="form-control my-3" name="email" placeholder="Enter email address" onChange={handleChange} />
                                {Error.Email && <p class="form-label font-weight-bold" style={{ color: "red" }}>{Error.Email}</p>}
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