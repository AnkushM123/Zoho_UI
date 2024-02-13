import Layout from "./layout";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import profileService from '../core/services/profile-service';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { configureToastOptions } from "../core/services/toast-service";
import EmployeeLayout from "./employeeLayout";
import decodeJwt from "../core/services/decodedJwtData-service";
import AdminLayout from "./adminLayout";
import defaultUser from './user_3177440.png'

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState([]);
    const [role, setRole] = useState('');
    const [manager, setManager] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await profileService.loggedInUser();
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

                    const managerDetailsResponse = await profileService.getManagerDetail(currentUser.managerId);
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
    }, [])

    const convertToDate = (timestamp) => {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${day}/${month}/${year}`;
    }

    const getGenderString = (gender) => {
        switch (gender) {
          case 0:
            return 'Male';
          case 1:
            return 'Female';
          default:
            return '';
        }
      };

    const navigateToEdit = () => {
        navigate('/edit');
    }

    const navigateToChangePassword = () => {
        navigate('/changePassword');
    }

    const handleImageError = (event) => {
        event.target.src = defaultUser;
        event.target.onerror = null;
    };

    return (<>
        {decodeJwt().role === 'Employee' ? (
            <EmployeeLayout />
        ) : decodeJwt().role === 'Manager' ? (
            <Layout />
        ) : (
            <AdminLayout />
        )}
        <div>
            <div className="container py-1">
                <div className="row">
                    <div className="col-lg-12">
                        <button type="button" class="btn btn-success float-right mx-2 my-3" onClick={navigateToChangePassword}>Change Password</button>
                        <button type="button" class="btn btn-success float-right my-3" onClick={navigateToEdit}>Edit</button>
                    </div>
                    <div className="col-lg-4">
                        <div className="card mb-4">
                            {user.map((userData) =>
                                <div className="card-body text-center" key={userData.employeeId}>
                                    <img src={process.env.REACT_APP_DOMAIN_URL + `/${userData.avatar}`} alt="avatar"
                                        className="rounded-circle img-fluid" onError={handleImageError} style={{ width: "200px", height: "200px" }} />
                                    <h5 className="my-3">{userData.name}</h5>
                                    <p className="text-muted mb-1">{role}</p>
                                    <p className="text-muted mb-4">{userData.address.city}</p>
                                </div>
                            )
                            }
                        </div>
                        {manager.length !== 0 && <div className="card mb-4">
                            {manager.map((manager) =>
                                <div className="card-body text-center" key={manager._id}>
                                    <h5 className="my-3">Reporting To:</h5>
                                    <p>
                                        <img
                                            src={process.env.REACT_APP_DOMAIN_URL + `/${manager.avatar}`}
                                            alt="Employee"
                                            height="30px"
                                            width="30px"
                                            style={{ borderRadius: "50%" }}
                                            onError={handleImageError}
                                        />  {manager.employeeId}-<span className="font-weight-bold">{manager.name}</span>
                                    </p>
                                </div>
                            )}
                        </div>
                        }
                    </div>
                    {
                        user.map((user) =>
                            <div class="col-lg-8">
                                <div class="card mb-4">
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-sm-3">
                                                <p class="mb-0">Employee No</p>
                                                <br></br>
                                            </div>
                                            <div class="col-sm-9">
                                                <p class="text-muted mb-0">{user.employeeId}</p>
                                            </div>
                                        </div>
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
                                                <p class="mb-0">Date Of Birth</p>
                                                <br></br>
                                            </div>
                                            <div class="col-sm-9">
                                                <p class="text-muted mb-0">{convertToDate(user.dateOfBirth)}</p>
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
                                                <p class="text-muted mb-0">{getGenderString(user.gender)}</p>
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
                                                <p class="mb-0">Address Line 1</p>
                                                <br></br>
                                            </div>
                                            <div class="col-sm-9">
                                                <p class="text-muted mb-0">{user.address.addressLine1}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-3">
                                                <p class="mb-0">Address Line 2</p>
                                                <br></br>
                                            </div>
                                            <div class="col-sm-9">
                                                <p class="text-muted mb-0">{user.address.addressLine2}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-3">
                                                <p class="mb-0">City</p>
                                                <br></br>
                                            </div>
                                            <div class="col-sm-9">
                                                <p class="text-muted mb-0">{user.address.city}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-3">
                                                <p class="mb-0">State</p>
                                                <br></br>
                                            </div>
                                            <div class="col-sm-9">
                                                <p class="text-muted mb-0">{user.address.state}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-3">
                                                <p class="mb-0">Country</p>
                                                <br></br>
                                            </div>
                                            <div class="col-sm-9">
                                                <p class="text-muted mb-0">{user.address.country}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-3">
                                                <p class="mb-0">Postal Code</p>
                                                <br></br>
                                            </div>
                                            <div class="col-sm-9">
                                                <p class="text-muted mb-0">{user.address.postalCode}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                </div>
            </div>
        </div>
    </>
    )
}

export default Profile