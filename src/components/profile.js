import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import profileService from '../core/services/profile-service';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { configureToastOptions } from "../core/services/toast-service";
import defaultUser from './user_3177440.png'

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState([]);
    const [role, setRole] = useState('');
    const [manager, setManager] = useState([]);
    const jwtToken = localStorage.getItem('authToken');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await profileService.loggedInUser(jwtToken);
                setUser(result.data);
                const jwtData = jwtToken.split('.')[1]
                const decodedJwtJsonData = window.atob(jwtData)
                const decodedJwtData = JSON.parse(decodedJwtJsonData)
                setRole(decodedJwtData.role)
                const managerPromises = result.data.map(async (currentUser) => {
                    const managerDetailsResponse = await profileService.getManagerDetail(currentUser.managerId,jwtToken);
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
                                        className="rounded-circle profileImage" onError={handleImageError} />
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
                                        <img className="employeesImage" src={process.env.REACT_APP_DOMAIN_URL + `/${manager.avatar}`} alt="Manager" height="30px" width="30px" /> {manager.name}
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
                                            <div class="col-sm-3 my-2">
                                                <p class="mb-0">Employee No</p>
                                            </div>
                                            <div class="col-sm-9 my-2">
                                                <p class="text-muted mb-0">{user.employeeId}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-3 my-2">
                                                <p class="mb-0">Full Name</p>
                                            </div>
                                            <div class="col-sm-9 my-2">
                                                <p class="text-muted mb-0">{user.name}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-3 my-2">
                                                <p class="mb-0">Email</p>
                                            </div>
                                            <div class="col-sm-9 my-2">
                                                <p class="text-muted mb-0">{user.email}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-3 my-2">
                                                <p class="mb-0">Date Of Birth</p>
                                            </div>
                                            <div class="col-sm-9 my-2">
                                                <p class="text-muted mb-0">{convertToDate(user.dateOfBirth)}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-3 my-2">
                                                <p class="mb-0">Mobile</p>
                                            </div>
                                            <div class="col-sm-9 my-2">
                                                <p class="text-muted mb-0">{user.mobile}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-3 my-2">
                                                <p class="mb-0">Gender</p>
                                            </div>
                                            <div class="col-sm-9 my-2">
                                                <p class="text-muted mb-0">{getGenderString(user.gender)}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-3 my-2">
                                                <p class="mb-0 font-weight-bold">Address:</p>
                                            </div>
                                            <div class="col-sm-9 my-2">
                                                <p class="text-muted mb-0"></p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-3 my-2">
                                                <p class="mb-0">Address Line 1</p>
                                            </div>
                                            <div class="col-sm-9 my-2">
                                                <p class="text-muted mb-0">{user.address.addressLine1}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-3 my-2">
                                                <p class="mb-0">Address Line 2</p>
                                            </div>
                                            <div class="col-sm-9 my-2">
                                                <p class="text-muted mb-0">{user.address.addressLine2}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-3 my-2">
                                                <p class="mb-0">City</p>
                                            </div>
                                            <div class="col-sm-9 my-2">
                                                <p class="text-muted mb-0">{user.address.city}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-3 my-2">
                                                <p class="mb-0">State</p>
                                            </div>
                                            <div class="col-sm-9 my-2">
                                                <p class="text-muted mb-0">{user.address.state}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-3 my-2">
                                                <p class="mb-0">Country</p>
                                            </div>
                                            <div class="col-sm-9 my-2">
                                                <p class="text-muted mb-0">{user.address.country}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-3 my-2">
                                                <p class="mb-0">Postal Code</p>
                                            </div>
                                            <div class="col-sm-9 my-2">
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