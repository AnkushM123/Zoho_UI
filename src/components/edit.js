import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./layout";
import mobileRegex from "../core/constants/mobile-regex";
import profileService from '../core/services/profile-service';
import { configureToastOptions } from "../core/services/toast-service";
import messages from "../core/constants/messages";
import updateService from '../core/services/update-service';
import decodeJwt from "../core/services/decodedJwtData-service";
import EmployeeLayout from './employeeLayout';
import AdminLayout from './adminLayout';

function Edit() {
    const navigate = useNavigate();
    const [user, setUser] = useState({ 'name': '', 'mobile': '', 'addressLine1': '', 'addressLine2': '', 'city': '', 'state': '', 'country': '', 'postalCode': '' });
    const [avatar, setAvatar] = useState('');
    const [error, setError] = useState({})
    const jwtToken = localStorage.getItem('authToken');
    const [manager, setManager] = useState([]);
    const id = decodeJwt().id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await profileService.loggedInUser(jwtToken);
                const managerPromises = result.data.map(async (user) => {
                    setUser({
                        'name': user.name,
                        'mobile': user.mobile,
                        'addressLine1': user.address.addressLine1,
                        'addressLine2': user.address.addressLine2,
                        'city': user.address.city,
                        'state': user.address.state,
                        'country': user.address.country,
                        'postalCode': user.address.postalCode,
                    });

                    setAvatar(user.avatar);
                    if (decodeJwt().role !== 'Admin') {
                        const managerDetailsResponse = await profileService.getManagerDetail(user.managerId, jwtToken);
                        setManager(managerDetailsResponse.data)
                    }
                })
            }
            catch (error) {
                const toastOptions = configureToastOptions();
                toast.options = toastOptions;
                toast.error(error);
            }
        }
        fetchData();
    }, [jwtToken])

    const validation = async () => {
        const error = {}
        if (!user.name) {
            error.name = messages.update.error.nameRequired;
        }

        if (!user.mobile) {
            error.mobile = messages.update.error.mobileRequired;
        } else if (!mobileRegex.test(user.mobile)) {
            error.mobile = messages.update.error.invalidMobile;
        }

        if (!user.addressLine1) {
            error.addressLine1 = messages.update.error.addressLine1Required;
        } else if (user.addressLine1.length > 200) {
            error.addressLine1 = messages.update.error.invalidAddressLine1;
        }

        if (!user.addressLine2) {
            error.addressLine2 = messages.update.error.addressLine2Required;
        } else if (user.addressLine2.length > 200) {
            error.addressLine2 = messages.update.error.invalidAddressLine2;
        }

        if (!user.city) {
            error.city = messages.update.error.cityRequired;
        } else if (user.city.length > 200) {
            error.city = messages.update.error.invalidCity;
        }

        if (!user.state) {
            error.state = messages.update.error.stateRequired;
        } else if (user.state.length > 200) {
            error.state = messages.update.error.invalidState;
        }

        if (!user.country) {
            error.country = messages.update.error.countryRequired;
        } else if (user.country.length > 200) {
            error.country = messages.update.error.invalidCountry;
        }

        if (!user.postalCode) {
            error.postalCode = messages.update.error.postalCodeRequired;
        } else if (user.postalCode.length > 200) {
            error.postalCode = messages.update.error.invalidPostalCode
        }
        setError(error);

        if (!user.name || !user.mobile || !mobileRegex.test(user.mobile) || !user.addressLine1 || user.addressLine1.length > 200 || !user.addressLine2 || user.addressLine2.length > 200 || !user.city || user.city.length > 200 || !user.state || user.state.length > 200 || !user.country || user.country.length > 200 || !user.postalCode || user.postalCode.length > 200) {
            return true;
        }
    };

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });

    }

    const updateUser = async (e) => {
        e.preventDefault();
        if (await validation()) {
            return;
        }

        const address = {
            'addressLine1': user.addressLine1,
            'addressLine2': user.addressLine2,
            'city': user.city,
            'state': user.state,
            'country': user.country,
            'postalCode': user.postalCode,
        }

        const formData = new FormData();
        formData.append('name', user.name);
        formData.append('mobile', user.mobile);
        formData.append('updatedBy', id);
        formData.append('address', JSON.stringify(address));

        try {
            await updateService.updateUser(id, formData, jwtToken);
            setTimeout(function () {
                const toastOptions = configureToastOptions();
                toast.options = toastOptions;
                toast.success(messages.update.success.userUpdated);
            });
            navigate('/profile');
        } catch (error) {
            const toastOptions = configureToastOptions();
            toast.options = toastOptions;
            toast.error(error);
        }
    }

    const navigateToProfile = () => {
        navigate('/profile');
    }

    return (
        <>
            <form action="#" method="post" encType="multipart/form-data" onSubmit={updateUser}>
                {decodeJwt().role === 'Employee' ? (
                    <EmployeeLayout />
                ) : decodeJwt().role === 'Manager' ? (
                    <Layout />
                ) : (
                    <AdminLayout />
                )}
                <div style={{ backgroundcolor: "#eee" }}>
                    <div class="container py-5">
                        <div class="row">
                            <div class="col-lg-4">
                                <div class="card mb-4">
                                    <div class="card-body text-center">
                                        <img src={process.env.REACT_APP_DOMAIN_URL + `/${avatar}`} alt="avatar"
                                            class="rounded-circle img-fluid" style={{ width: "200px", height: "200px" }} />
                                        <h5 class="my-3">{user.name}</h5>
                                        <p class="text-muted mb-4">{user.city}</p>
                                    </div>
                                </div>
                                {manager && <div className="card mb-4">
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
                                                />  {manager.name}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                }
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
                                                <input type="text" class="form-control" id="name" name="name" onChange={handleChange} value={user.name} />
                                                {error.name && <p style={{ color: "red" }}>{error.name}</p>}
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-3">
                                                <p class="mb-0">Mobile</p>
                                                <br></br>
                                            </div>
                                            <div class="col-sm-9">
                                                <input type="tel" class="form-control" id="mobile" name="mobile" onChange={handleChange} value={user.mobile} />
                                                {error.mobile && <p style={{ color: "red" }}>{error.mobile}</p>}
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
                                                <input type="text" class="form-control" id="addressLine1" name="addressLine1" onChange={handleChange} value={user.addressLine1} />
                                                {error.addressLine1 && <p style={{ color: "red" }}>{error.addressLine1}</p>}
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-3">
                                                <p class="mb-0">address Line2</p>
                                                <br></br>
                                            </div>
                                            <div class="col-sm-9">
                                                <input type="text" class="form-control" id="addressLine2" name="addressLine2" onChange={handleChange} value={user.addressLine2} />
                                                {error.addressLine2 && <p style={{ color: "red" }}>{error.addressLine2}</p>}
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-3">
                                                <p class="mb-0">city</p>
                                                <br></br>
                                            </div>
                                            <div class="col-sm-9">
                                                <input type="text" class="form-control" id="city" name="city" onChange={handleChange} value={user.city} />
                                                {error.city && <p style={{ color: "red" }}>{error.city}</p>}
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-3">
                                                <p class="mb-0">state</p>
                                                <br></br>
                                            </div>
                                            <div class="col-sm-9">
                                                <input type="text" class="form-control" id="state" name="state" onChange={handleChange} value={user.state} />
                                                {error.state && <p style={{ color: "red" }}>{error.state}</p>}
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-3">
                                                <p class="mb-0">country</p>
                                                <br></br>
                                            </div>
                                            <div class="col-sm-9">
                                                <input type="text" class="form-control" id="country" name="country" onChange={handleChange} value={user.country} />
                                                {error.country && <p style={{ color: "red" }}>{error.country}</p>}
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-3">
                                                <p class="mb-0">postal code</p>
                                                <br></br>
                                            </div>
                                            <div class="col-sm-9">
                                                <input type="text" class="form-control" id="postalCode" name="postalCode" onChange={handleChange} value={user.postalCode} />
                                                {error.postalCode && <p style={{ color: "red" }}>{error.postalCode}</p>}
                                            </div>
                                        </div>
                                        <button style={{ margin: "10px" }} type="submit" class="btn btn-dark">Save</button>
                                        <button class="btn btn-dark" onClick={navigateToProfile}>Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>)
}

export default Edit;

