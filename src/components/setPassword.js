import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import messages from "../core/constants/messages";
import passwordRegex from "../core/constants/passwordRegex";
import setPasswordService from "../core/services/setPassword-service";
import '../App.css';

function SetPassword() {
    const [Message, setMessage] = useState('');
    const [Data, setData] = useState({
        password: ''
    })
    const [inputData, setInputData] = useState({
        password: '',
        confirmPassword: ''
    })
    const [Error, setError] = useState({});

    const validation = () => {
        const error = {}
        if (!inputData.password.trim()) {
            error.Password = messages.setPasswordUi.passwordRequired;
        } else if (!passwordRegex.test(inputData.password)) {
            error.Password = messages.setPasswordUi.passwordValidation;
        }

        if (!inputData.confirmPassword.trim()) {
            error.ConfirmPassword = messages.setPasswordUi.confirmPasswordRequired;
        } else if (!passwordRegex.test(inputData.confirmPassword)) {
            error.ConfirmPassword = messages.setPasswordUi.passwordValidation;
        }
        setError(error);
    };

    const handleChange = (e) => {
        setInputData({ ...inputData, [e.target.name]: e.target.value })
    }

    const loginData = async (e) => {
        e.preventDefault();
        validation();

        if (!inputData.password.trim() || !passwordRegex.test(inputData.password) || !inputData.confirmPassword.trim() || !passwordRegex.test(inputData.confirmPassword)) {
            return;
        }

        if (inputData.password !== inputData.confirmPassword) {
            setMessage(messages.setPasswordUi.passwordUnmatched);
            return;
        }

        setData({ password: inputData.password });
        const id = localStorage.getItem("id");
        try {
            await setPasswordService(inputData, id);
            setMessage('');
            setTimeout(function () {
                toast.options = {
                    closeButton: true,
                    progressBar: true,
                    showMethod: 'slideDown',
                    timeOut: 500
                };
                toast.success(messages.setPasswordUi.passwordChanged);
            });
        } catch (error) {
            setTimeout(function () {
                toast.options = {
                    closeButton: true,
                    progressBar: true,
                    showMethod: 'slideDown',
                    timeOut: 500
                };
                toast.error(error);
            })
        }
    }

    return (
        <>
            <center>
                <div class="card text-center" style={{ width: "600px", marginTop: "60px" }}>
                    <div class="card-header h5 text-white bg-primary gradient-custom-2">Password Reset</div>
                    <div class="card-body px-5">
                        <form action="#" method="post" onSubmit={loginData}>
                            <div class="mb-3">
                                <label for="password" class="form-label font-weight-bold" style={{ marginRight: "340px" }}>New Password:</label>
                                <input type="password" class="form-control" id="password" name="password" placeholder="enter new password" onChange={handleChange} />
                                {Error.Password && <p class="form-label font-weight-bold" style={{ color: "red" }}>{Error.Password}</p>}
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label font-weight-bold" style={{ marginRight: "340px" }}>Confirm Password:</label>
                                <input type="password" class="form-control" id="confirmPassword" name="confirmPassword" placeholder="enter confirm password" onChange={handleChange} />
                                {Error.ConfirmPassword && <p class="form-label font-weight-bold" style={{ color: "red" }}>{Error.ConfirmPassword}</p>}
                            </div>
                            <br></br>
                            <button type="submit" class="btn btn-primary w-100 gradient-custom-2">Change Password</button>
                        </form>
                        <div class="d-flex justify-content-between mt-4">
                            <Link to="/">Back to login</Link>
                        </div>
                    </div>
                </div>
                {Error.Email && <p class="form-label font-weight-bold" style={{ color: "red" }}>{Error.Email}</p>}
                {Message && <p className="form-label font-weight-bold" style={{ color: "red" }}>{Message}</p>}
            </center>
        </>
    )
}

export default SetPassword;