import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css'

function Login() {
  const navigate = useNavigate()
  const [inputData, setInputData] = useState({
    email: '',
    password: ''
  })
  const [Error, setError] = useState({})

  const validation = () => {
    const error = {};

    if (!inputData.email.trim()) {
      error.Email = "Email is required";
    }

    if (!inputData.password.trim()) {
      error.Password = "Password is required";
    }
    setError(error);
  };

  const handleChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value })

  }

  const loginData = (e) => {
    e.preventDefault();

    validation();

    if (!inputData.email.trim() || !inputData.password.trim()) {
      return
    }
    axios.post("http://localhost:3000/auth/login", inputData)
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem('authToken', res.data.token);
          axios.post("http://localhost:3000/user/getEmail", { "email": inputData.email })
            .then((res) => {
            })
            .catch((err) => console.log(err));
          setTimeout(function () {
            toast.options = {
              closeButton: true,
              progressBar: true,
              showMethod: 'slideDown',
              timeOut: 500
            };
            toast.success('Successful Login');
          });
          if (localStorage.getItem('id')) {
            localStorage.removeItem('id');
          }
          navigate('/employee/home');
        }
      }
      )
      .catch((err) => {
        toast.options = {
          closeButton: true,
          progressBar: true,
          showMethod: 'slideDown',
          timeOut: 500
        };
        toast.error('Credentials are invalid');
        console.log(err);
      }
      )
  }

  return (
    <section class="h-100 gradient-form" style={{ backgroundcolor: "#eee;" }}>
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
                        <label class="form-label" for="form2Example11">Email</label>
                        <input type="text" id="email" class="form-control"
                          placeholder="enter email address" name="email" onChange={handleChange} />
                        {Error.Email && <p style={{ color: "red" }}>{Error.Email}</p>}
                      </div>

                      <div class="form-outline mb-4">
                        <label class="form-label" for="form2Example22">Password</label>
                        <input type="password" id="password" class="form-control" name="password" placeholder="enter password" onChange={handleChange} />
                        {Error.Password && <p style={{ color: "red" }}>{Error.Password}</p>}
                      </div>

                      <div class="text-center pt-1 mb-5 pb-1">
                        <button class="btn btn-primary btn-block fa-lg gradient-custom-2 mb-3" type="submit">Log
                          in</button>
                        <Link class="text-muted" to="/forgotPassword">Forgot password?</Link>
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