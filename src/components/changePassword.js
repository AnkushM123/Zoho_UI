import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeLayout from "./employeeLayout";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { configureToastOptions } from "../core/services/toast-service";
import messages from "../core/constants/messages";
import decodeJwt from "../core/services/decodedJwtData-service";
import AdminLayout from "./adminLayout";
import Layout from "./layout";
import passwordRegex from "../core/constants/password-regex";
import changePasswordService from "../core/services/changePassword-service"

function ChangePassword() {
    const navigate = useNavigate();
    const id = decodeJwt().id;
    const jwtToken = localStorage.getItem('authToken');
    const [error, setError] = useState({});
    const [inputData, setInputData] = useState({});
    const [message, setMessage] = useState('');

    const validation = async () => {
        const error = {}

        if (!inputData.oldPassword) {
            error.oldPassword = messages.changePassword.error.oldPasswordRequired;
        }

        if (!inputData.newPassword) {
            error.newPassword = messages.changePassword.error.passwordRequired;
        } else if (!passwordRegex.test(inputData.newPassword)) {
            error.newPassword = messages.changePassword.error.invalidPassword;
        }

        if (!inputData.confirmNewPassword) {
            error.confirmNewPassword = messages.changePassword.error.confirmPasswordRequired;
        } else if (!passwordRegex.test(inputData.confirmNewPassword)) {
            error.confirmNewPassword = messages.changePassword.error.invalidPassword;
        }
        setError(error);
        if (!inputData.newPassword || !passwordRegex.test(inputData.newPassword) || !inputData.confirmNewPassword || !passwordRegex.test(inputData.confirmNewPassword)) {
            return true;
        }
    };

    const handleChange = (e) => {
        setInputData({ ...inputData, [e.target.name]: e.target.value });
    }

    const changePassword = async (e) => {
        e.preventDefault();
        if (await validation()) {
            return;
        }

        if (inputData.confirmNewPassword !== inputData.newPassword) {
            setMessage(messages.changePassword.error.NewBothUnmatched);
            return;
        }
        try {
            await changePasswordService(inputData, id, jwtToken);
            setMessage('');
            setTimeout(function () {
                const toastOptions = configureToastOptions();
                toast.options = toastOptions;
                toast.success(messages.changePassword.success.passwordChanged);
            });
            navigate('/');
        } catch (error) {
            setMessage(messages.changePassword.error.oldPasswordUnmatched);
        }
    }

    const navigateToProfile = () => {
        navigate('/profile');
    }

    return (
        <>
            {decodeJwt().role === 'Employee' ? (
                <EmployeeLayout />
            ) : decodeJwt().role === 'Manager' ? (
                <Layout />
            ) : (
                <AdminLayout />
            )}
            <form action="#" method="post" onSubmit={changePassword}>
                <div class="container py-5">
                    <div class="row justify-content-center">
                        <div class="col-lg-8">
                            <div class="card mb-4">
                                <div class="card-body">
                                    <div className="row py-2">
                                        <div className="col-sm-3">
                                            <p className="form-label font-weight-bold">Old Password:</p>
                                            <br />
                                        </div>
                                        <div className="col-sm-9">
                                            <input type="password" className="form-control" name="oldPassword" placeholder="Enter old password" onChange={handleChange} />
                                            {error.oldPassword && <p class="form-label errorColor">{error.oldPassword}</p>}
                                        </div>
                                    </div>
                                    <div className="row py-2">
                                        <div className="col-sm-3">
                                            <p className="form-label font-weight-bold">New Password:</p>
                                            <br />
                                        </div>
                                        <div className="col-sm-9">
                                            <input type="password" className="form-control" name="newPassword" placeholder="Enter new password" onChange={handleChange} />
                                            {error.newPassword && <p class="form-label errorColor">{error.newPassword}</p>}
                                        </div>
                                    </div>
                                    <div className="row py-2">
                                        <div className="col-sm-3">
                                            <p className="form-label font-weight-bold">Confirm New Password:</p>
                                            <br />
                                        </div>
                                        <div className="col-sm-9">
                                            <input type="password" className="form-control" name="confirmNewPassword" placeholder="Enter confirm new password" onChange={handleChange} />
                                            {error.confirmNewPassword && <p class="form-label errorColor">{error.confirmNewPassword}</p>}
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