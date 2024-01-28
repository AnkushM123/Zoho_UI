import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';
import messages from "../core/constants/messages";
import auth from '../core/services/auth-service';
import { configureToastOptions } from "../core/services/toast-service";

function Login() {
    const navigate = useNavigate();
    const [inputData, setInputData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState({});

    const validation = () => {
        const error = {};
        if (!inputData.email.trim()) {
            error.email = messages.login.error.emailRequired;
        }

        if (!inputData.password.trim()) {
            error.password = messages.login.error.passwordRequired;
        }
        setError(error);
        if (!inputData.email.trim() || !inputData.password.trim()) {
            return true;
        }
    };

    const handleChange = (e) => {
        setInputData({ ...inputData, [e.target.name]: e.target.value });
    }

    const loginData = async (e) => {
        e.preventDefault();
        if (validation()) {
            return;
        }

        try {
            const result = await auth.login(inputData);
            localStorage.setItem('authToken', result.data.token);

            setTimeout(function () {
                const toastOptions = configureToastOptions();
                toast.options = toastOptions;
                toast.success(messages.login.success.toastSuccess);
            })
            if (localStorage.getItem('id')) {
                localStorage.removeItem('id');
            }
            let jwtData = result.data.token.split('.')[1]
          let decodedJwtJsonData = window.atob(jwtData)
          let decodedJwtData = JSON.parse(decodedJwtJsonData)
            localStorage.setItem('id',decodedJwtData.id);
            localStorage.setItem('role',decodedJwtData.role); 
            if(decodedJwtData.role==='Manager'){
            navigate('/home');
            }else{
                navigate('/profile');
            }
        } catch (error) {
            const toastOptions = configureToastOptions();
            toast.options = toastOptions;
            toast.error(messages.login.error.toastError);
        }
    }

    return (
        <section class="h-100 gradient-form" style={{ backgroundcolor: "#eee" }}>
            <div class="container py-3 h-100">
                <div class="row d-flex justify-content-center align-items-center h-100">
                    <div class="col-xl-10">
                        <div class="card rounded-3 text-black">
                            <div class="row g-0">
                                <div class="col-lg-6">
                                    <div class="card-body p-md-5 mx-md-4">
                                        <div class="text-center">
                                            <img src="https://www.zohowebstatic.com/sites/zweb/images/commonroot/zoho-logo-web.svg"
                                                style={{ width: "185px" }} alt="logo" />
                                            <br></br>
                                            <h2 class="mt-1 mb-5 pb-1" style={{ color: "blueviolet" }}>Login</h2>
                                        </div>

                                        <form method="post" onSubmit={loginData}>
                                            <div class="form-outline mb-4">
                                                <label class="form-label">Email</label>
                                                <input type="text" id="email" class="form-control"
                                                    placeholder="enter email address" name="email" onChange={handleChange} />
                                                {error.email && <p style={{ color: "red" }}>{error.email}</p>}
                                            </div>

                                            <div class="form-outline mb-4">
                                                <label class="form-label">Password</label>
                                                <input type="password" id="password" class="form-control" name="password" placeholder="enter password" onChange={handleChange} />
                                                {error.password && <p style={{ color: "red" }}>{error.password}</p>}
                                            </div>

                                            <div class="text-center pt-1 mb-5 pb-1">
                                                <button class="btn btn-primary btn-block fa-lg gradient-custom-2 mb-3" type="submit">Log
                                                    in</button>
                                                <Link class="text-muted" to="/varifyEmail">Forgot password?</Link>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div class="col-lg-6 d-flex align-items-center gradient-custom-2">
                                    <div class="text-white px-3 py-4 p-md-5 mx-md-4">
                                        <h4 class="mb-4">Zoho One</h4>
                                        <p class="small mb-0">Run your entire business on Zoho with our unified cloud software, designed to help you break down silos between departments and increase organizational efficiency</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Login;