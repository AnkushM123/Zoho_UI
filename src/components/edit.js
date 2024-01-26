import { useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "./layout";
import mobileRegex from "../core/constants/mobileRegex";
import emailRegex from "../core/constants/email-regex";

function Edit() {
    const navigate = useNavigate();
    const [User, setUser] = useState({ 'name': '', 'age': '', 'mobile': '', 'email': '', 'addressLine1': '', 'addressLine2': '', 'city': '', 'state': '', 'country': '', 'postalCode': '' });
    const [Result, setResult] = useState([]);
    const jwtToken = localStorage.getItem('authToken');
    const [Avatar, setAvatar] = useState('');
    const [Error, setError] = useState({})
    const [EmailMessage, setEmailMessage] = useState('');
    const [EmailExist,setEmailExist]=useState(false);

    useEffect(() => {
        axios.get(`http://localhost:3000/user`, {
            headers: {
                'Authorization': `Bearer ${jwtToken}`
            }
        })
            .then(result => {
                {
                    result.data.map((user) => {
                        setUser({
                            'name': user.name,
                            'age': user.age,
                            'mobile': user.mobile,
                            'email': user.email,
                            'addressLine1': user.address.addressLine1,
                            'addressLine2': user.address.addressLine2,
                            'city': user.address.city,
                            'state': user.address.state,
                            'country': user.address.country,
                            'postalCode': user.address.postalCode,
                        });

                        setAvatar(user.avatar);

                    })
                }
            })
            .catch(err => console.log(err));

    }, [])

    const checkEmail = () => {
        axios.post(`http://localhost:3000/user/isVarifyEmail`, { email: User.email })
            .then((res) => {
                if (res.status === 200) {
                    setEmailMessage('Email is already registered');
                }
                setEmailExist(true);
            })
            .catch((err) => {
                setEmailMessage('');
            })
    }

    const validation = () => {
        const error = {}
        if (!User.name) {
            error.Name = "Name is required";
        }

        if (!User.email) {
            error.Email = "Email is required";
        } else if (!emailRegex.test(User.email)) {
            error.Email = "Email is invalid";
        }

        if (true) {
            checkEmail();
        }

        if (!User.age) {
            error.Age = "Age is required";
        } else if (!(0 < User.age && 60 >= User.age)) {
            error.Age = "Age invalid";
        }

        if (!User.mobile) {
            error.Mobile = "Mobile number is required";
        } else if (!mobileRegex.test(User.mobile)) {
            error.Mobile = "Mobile number is invalid";
        }

        if (!User.addressLine1) {
            error.AddressLine1 = "Address line 1 is required";
        } else if (User.addressLine1.length > 200) {
            error.AddressLine1 = "Address line1 length must be within 200 words"
        }

        if (!User.addressLine2) {
            error.AddressLine2 = "Address line 2 is required";
        } else if (User.addressLine2.length > 200) {
            error.AddressLine2 = "Address line 2 length must be within 200 words"
        }

        if (!User.city) {
            error.City = "City is required";
        } else if (User.city.length > 200) {
            error.City = "City length must be within 200 words"
        }

        if (!User.state) {
            error.State = "State is required";
        } else if (User.state.length > 200) {
            error.State = "State length must be within 200 words"
        }

        if (!User.country) {
            error.Country = "Country is required";
        } else if (User.country.length > 200) {
            error.Country = "Country length must be within 200 words"
        }

        if (!User.postalCode.trim()) {
            error.PostalCode = "Postal code is required";
        } else if (User.postalCode.length > 200) {
            error.PostalCode = "Postal code length must be within 200 words"
        }
        setError(error);
    };

    const handleChange = (e) => {
        setUser({ ...User, [e.target.name]: e.target.value });
        if (checkEmail()) {
            return;
        }
    }

    const updateUser = (e) => {
        e.preventDefault();
        validation();
        const id=localStorage.getItem('id');
        const formData = new FormData();
        // formData.append('name', User.name);
        // formData.append('age', User.age);
        // formData.append('mobile', User.mobile);
        // formData.append('email', Employee.email);
        // formData.append('updatedBy', id);
        // formData.append('address', address:{
            
        // });

        axios.put(`http://localhost:3000/user/${id}`, formData, {
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'multipart/form-data',
            },
        })
            .then((res) => {
                if (res.status === 200) {
                    setTimeout(function () {
                        toast.options = {
                            closeButton: true,
                            progressBar: true,
                            showMethod: 'slideDown',
                            timeOut: 500
                        };
                        toast.success('Employee Updated');
                    });
                    navigate('/employee');
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const navigateToProfile = () => {
        navigate('/profile');
    }

    return (
        <>
            <Layout></Layout>
            <div style={{ backgroundcolor: "#eee" }}>
                <div class="container py-5">
                    <form action="#" method="post" enctype="multipart/form-data" onSubmit={updateUser}>
                        <div class="row">
                            <div class="col-lg-4">
                                <div class="card mb-4">
                                    <div class="card-body text-center">
                                        <img src={`http://localhost:3000/${Avatar}`} alt="avatar"
                                            class="rounded-circle img-fluid" style={{ width: "200px", height: "200px" }} />
                                        <h5 class="my-3">{User.name}</h5>
                                        <p class="text-muted mb-4">{User.city}</p>
                                    </div>
                                </div>
                                <div class="card mb-4 mb-lg-0">
                                    <div class="card-body p-0">
                                        <ul class="list-group list-group-flush rounded-3">
                                            <li class="list-group-item d-flex justify-content-between align-items-center p-3">
                                                <i class="fas fa-globe fa-lg text-warning"></i>
                                                <p class="mb-0">https://mdbootstrap.com</p>
                                            </li>
                                            <li class="list-group-item d-flex justify-content-between align-items-center p-3">
                                                <i class="fab fa-github fa-lg" style={{ color: "#333333" }}></i>
                                                <p class="mb-0">mdbootstrap</p>
                                            </li>
                                            <li class="list-group-item d-flex justify-content-between align-items-center p-3">
                                                <i class="fab fa-twitter fa-lg" style={{ color: "#55acee" }}></i>
                                                <p class="mb-0">@mdbootstrap</p>
                                            </li>
                                            <li class="list-group-item d-flex justify-content-between align-items-center p-3">
                                                <i class="fab fa-instagram fa-lg" style={{ color: "#ac2bac" }}></i>
                                                <p class="mb-0">mdbootstrap</p>
                                            </li>
                                            <li class="list-group-item d-flex justify-content-between align-items-center p-3">
                                                <i class="fab fa-facebook-f fa-lg" style={{ color: "#3b5998" }}></i>
                                                <p class="mb-0">mdbootstrap</p>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div class="col-lg-8">
                                <div class="card mb-4">
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-sm-3">
                                                <p class="mb-0">Full Name</p>
                                                <br></br>
                                            </div>
                                            <div class="col-sm-9">
                                                <input type="text" class="form-control" id="name" name="name" onChange={handleChange} value={User.name} />
                                                {Error.Name && <p style={{ color: "red" }}>{Error.Name}</p>}
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-sm-3">
                                                <p class="mb-0">Email</p>
                                                <br></br>
                                            </div>
                                            <div class="col-sm-9">
                                                <input type="text" class="form-control" id="email" name="email" onChange={handleChange} value={User.email} />
                                                {Error.Email && <p style={{ color: "red" }}>{Error.Email}</p>}
                                                <p style={{ color: "red" }}>{EmailMessage}</p>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-sm-3">
                                                <p class="mb-0">Age</p>
                                                <br></br>
                                            </div>
                                            <div class="col-sm-9">
                                                <input type="number" class="form-control" id="age" name="age" onChange={handleChange} value={User.age} />
                                                {Error.Age && <p style={{ color: "red" }}>{Error.Age}</p>}
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-sm-3">
                                                <p class="mb-0">Mobile</p>
                                                <br></br>
                                            </div>
                                            <div class="col-sm-9">
                                                <input type="tel" class="form-control" id="mobile" name="mobile" onChange={handleChange} value={User.mobile} />
                                                {Error.Mobile && <p style={{ color: "red" }}>{Error.Mobile}</p>}
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-sm-3">
                                                <p class="mb-0 font-weight-bold">Address:</p>
                                                <br></br>
                                            </div>
                                            <div class="col-sm-9">
                                                <p class="text-muted mb-0"></p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-3">
                                                <p class="mb-0">address Line1</p>
                                                <br></br>
                                            </div>
                                            <div class="col-sm-9">
                                                <input type="text" class="form-control" id="addressLine1" name="addressLine1" onChange={handleChange} value={User.addressLine1} />
                                                {Error.AddressLine1 && <p style={{ color: "red" }}>{Error.AddressLine1}</p>}
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-3">
                                                <p class="mb-0">address Line2</p>
                                                <br></br>
                                            </div>
                                            <div class="col-sm-9">
                                                <input type="text" class="form-control" id="addressLine2" name="addressLine2" onChange={handleChange} value={User.addressLine2} />
                                                {Error.AddressLine2 && <p style={{ color: "red" }}>{Error.AddressLine2}</p>}
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-3">
                                                <p class="mb-0">city</p>
                                                <br></br>
                                            </div>
                                            <div class="col-sm-9">
                                                <input type="text" class="form-control" id="city" name="city" onChange={handleChange} value={User.city} />
                                                {Error.City && <p style={{ color: "red" }}>{Error.City}</p>}
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-3">
                                                <p class="mb-0">state</p>
                                                <br></br>
                                            </div>
                                            <div class="col-sm-9">
                                                <input type="text" class="form-control" id="state" name="state" onChange={handleChange} value={User.state} />
                                                {Error.State && <p style={{ color: "red" }}>{Error.State}</p>}
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-3">
                                                <p class="mb-0">country</p>
                                                <br></br>
                                            </div>
                                            <div class="col-sm-9">
                                                <input type="text" class="form-control" id="country" name="country" onChange={handleChange} value={User.country} />
                                                {Error.Country && <p style={{ color: "red" }}>{Error.Country}</p>}
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-3">
                                                <p class="mb-0">postal code</p>
                                                <br></br>
                                            </div>
                                            <div class="col-sm-9">
                                                <input type="text" class="form-control" id="postalCode" name="postalCode" onChange={handleChange} value={User.postalCode} />
                                                {Error.PostalCode && <p style={{ color: "red" }}>{Error.PostalCode}</p>}
                                            </div>
                                        </div>
                                        <button style={{ margin: "10px" }} type="submit" class="btn btn-dark">Save</button>
                                        <button class="btn btn-dark" onClick={navigateToProfile}>Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>)
}

export default Edit;

