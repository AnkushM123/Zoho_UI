import Layout from "./layout";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import profileService from '../core/services/profile-service';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Profile() {
    const [User, setUser] = useState([]);
    const [Role, setRole] = useState('');
    const jwtToken = localStorage.getItem('authToken');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await profileService(jwtToken);
                setUser(result.data);
                User.map((user) => {
                    if (user.roles.includes("658eacbb510f63f754e68d02")) {
                        setRole('Admin');
                    } else {
                        if (user.roles.includes("658eac9e510f63f754e68cfe")) {
                            setRole('Manager');
                        } else {
                            setRole('Employee');
                        }
                    }
                })
            } catch (error) {
                setTimeout(function () {
                    toast.options = {
                        closeButton: true,
                        progressBar: true,
                        showMethod: 'slideDown',
                        timeOut: 500,
                    };
                    toast.error(error);
                });
            }
        }
        fetchData();
    }, [jwtToken])

    return (<>
        <Layout></Layout>
        <div style={{ backgroundcolor: "#eee" }}>
            <div class="container py-5">
                <Link to="/edit" class="link-primary font-weight-bold" style={{ marginLeft: "1050px" }}>Edit</Link>
                <div class="row">
                    <div class="col-lg-4">
                        <div class="card mb-4">
                            {
                                User.map((user) =>
                                    <div class="card-body text-center">
                                        <img src={`http://localhost:3000/${user.avatar}`} alt="avatar"
                                            class="rounded-circle img-fluid" style={{ width: "200px", height: "200px" }} />
                                        <h5 class="my-3">{user.name}</h5>
                                        <p class="text-muted mb-1">{Role}</p>
                                        <p class="text-muted mb-4">{user.address.city}</p>
                                    </div>
                                )
                            }
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
                    {
                        User.map((user) =>
                            <div class="col-lg-8">
                                <div class="card mb-4">
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-sm-3">
                                                <p class="mb-0">Full Name</p>
                                                <br></br>
                                            </div>
                                            <div class="col-sm-9">
                                                <p class="text-muted mb-0">{user.name}</p>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-sm-3">
                                                <p class="mb-0">Email</p>
                                                <br></br>
                                            </div>
                                            <div class="col-sm-9">
                                                <p class="text-muted mb-0">{user.email}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-3">
                                                <p class="mb-0">Age</p>
                                                <br></br>
                                            </div>
                                            <div class="col-sm-9">
                                                <p class="text-muted mb-0">{user.age}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-3">
                                                <p class="mb-0">Mobile</p>
                                                <br></br>
                                            </div>
                                            <div class="col-sm-9">
                                                <p class="text-muted mb-0">{user.mobile}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-3">
                                                <p class="mb-0">Gender</p>
                                                <br></br>
                                            </div>
                                            <div class="col-sm-9">
                                                <p class="text-muted mb-0">{user.gender}</p>
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
                                                <p class="text-muted mb-0">{user.address.addressLine1}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-3">
                                                <p class="mb-0">address Line2</p>
                                                <br></br>
                                            </div>
                                            <div class="col-sm-9">
                                                <p class="text-muted mb-0">{user.address.addressLine2}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-3">
                                                <p class="mb-0">city</p>
                                                <br></br>
                                            </div>
                                            <div class="col-sm-9">
                                                <p class="text-muted mb-0">{user.address.city}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-3">
                                                <p class="mb-0">state</p>
                                                <br></br>
                                            </div>
                                            <div class="col-sm-9">
                                                <p class="text-muted mb-0">{user.address.state}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-3">
                                                <p class="mb-0">country</p>
                                                <br></br>
                                            </div>
                                            <div class="col-sm-9">
                                                <p class="text-muted mb-0">{user.address.country}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-3">
                                                <p class="mb-0">postal code</p>
                                                <br></br>
                                            </div>
                                            <div class="col-sm-9">
                                                <p class="text-muted mb-0">{user.address.postalCode}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    </>
    )
}

export default Profile