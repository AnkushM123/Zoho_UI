import Layout from "./layout";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import profileService from '../core/services/profile-service';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { configureToastOptions } from "../core/services/toast-service";
import EmployeeLayout from "./employeeLayout";
import decodeJwt from "../core/services/decodedJwtData-service";

function Profile() {
    const [user, setUser] = useState([]);
    const [role, setRole] = useState('');
    const jwtToken = localStorage.getItem('authToken');
    const [manager, setManager] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await profileService.loggedInUser(jwtToken);
                setUser(result.data);
                const managerPromises = result.data.map(async (currentUser) => {
                    if (currentUser.roles.includes("658eacbb510f63f754e68d02")) {
                        setRole('Admin');
                    } else {
                        if (currentUser.roles.includes("658eac9e510f63f754e68cfe")) {
                            setRole('Manager');
                        } else {
                            setRole('Employee');
                        }
                    }
                    const managerDetailsResponse = await profileService.getManagerDetail(currentUser.managerId, jwtToken);
                    setManager(managerDetailsResponse.data)

                });
                await Promise.all(managerPromises);

            } catch (error) {
                const toastOptions = configureToastOptions();
                toast.options = toastOptions;
                toast.error(error);
            }
        }
        fetchData();
    }, [jwtToken])

    return (<>
         { decodeJwt().role === 'Employee' ? (
            <EmployeeLayout />
        ) : (
            <Layout />
        )
        } 
        <div style={{ backgroundcolor: "#eee" }}>
            <div class="container py-5">
                <Link to="/edit" class="link-primary font-weight-bold" style={{ marginLeft: "1050px" }}>Edit</Link>
                <div class="row">
                    <div class="col-lg-4">
                        <div class="card mb-4">
                            {
                                user.map((user) =>
                                    <div class="card-body text-center">
                                        <img src={process.env.REACT_APP_DOMAIN_URL + `/${user.avatar}`} alt="avatar"
                                            class="rounded-circle img-fluid" style={{ width: "200px", height: "200px" }} />
                                        <h5 class="my-3">{user.name}</h5>
                                        <p class="text-muted mb-1">{role}</p>
                                        <p class="text-muted mb-4">{user.address.city}</p>
                                    </div>
                                )
                            }
                        </div>
                        <div className="card mb-4">
                            {manager.map((manager) =>
                                <div className="card-body text-center" key={manager._id}>
                                    <h5 className="my-3">Reporting To:</h5>
                                    <p style={{ color: "darkcyan" }}>
                                        <img
                                            src={process.env.REACT_APP_DOMAIN_URL + `/${manager.avatar}`}
                                            alt="Manager"
                                            height="30px"
                                            width="30px"
                                            style={{ borderRadius: "50%" }}
                                        />
                                        {manager.name}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                    {
                        user.map((user) =>
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