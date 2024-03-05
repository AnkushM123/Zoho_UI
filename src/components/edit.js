import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./layout";
import mobileRegex from "../core/constants/mobile-regex";
import emailRegex from "../core/constants/email-regex";
import profileService from '../core/services/profile-service';
import { configureToastOptions } from "../core/services/toast-service";
import messages from "../core/constants/messages";
import updateService from '../core/services/update-service';

function Edit() {
    const navigate = useNavigate();
    const [user, setUser] = useState({ 'name': '', 'age': '', 'mobile': '', 'email': '', 'addressLine1': '', 'addressLine2': '', 'city': '', 'state': '', 'country': '', 'postalCode': '' });
    const [avatar, setAvatar] = useState('');
    const [error, setError] = useState({})
    const jwtToken = localStorage.getItem('authToken');
    const [manager, setManager] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await profileService.loggedInUser(jwtToken);
                result.data.map(async (user) => {
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
                    const managerDetailsResponse = await profileService.getManagerDetail(user.managerId, jwtToken);
                    setManager(managerDetailsResponse.data)
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

        if (!user.email) {
            error.email = messages.update.error.emailRequired;
        } else if (!emailRegex.test(user.email)) {
            error.email = messages.update.error.invalidEmail;
        }

        if (!user.age) {
            error.age = messages.update.error.ageRequired;
        } else if (!(0 < user.age && 60 >= user.age)) {
            error.age = messages.update.error.invalidAge;
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

        if (!user.name || !user.email || !emailRegex.test(user.email) || !user.age || !(0 < user.age && 60 >= user.age) || !user.mobile || !mobileRegex.test(user.mobile) || !user.addressLine1 || user.addressLine1.length > 200 || !user.addressLine2 || user.addressLine2.length > 200 || !user.city || user.city.length > 200 || !user.state || user.state.length > 200 || !user.country || user.country.length > 200 || !user.postalCode || user.postalCode.length > 200) {
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

        const id = localStorage.getItem('id');
        const formData = new FormData();
        formData.append('name', user.name);
        formData.append('age', user.age);
        formData.append('mobile', user.mobile);
        formData.append('email', user.email);
        formData.append('updatedBy', id);
        formData.append('address[addressLine1]', user.addressLine1);
        formData.append('address[addressLine2]', user.addressLine2);
        formData.append('address[city]', user.city);
        formData.append('address[state]', user.state);
        formData.append('address[country]', user.country);
        formData.append('address[postalCode]', user.postalCode);

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

    return (<>
        <Layout></Layout>
        <form action="#" method="post" encType="multipart/form-data" onSubmit={updateUser}>
            <div class="container py-5">
                <div class="row">
                    <div class="col-lg-4">
                        <div class="card mb-4">
                            <div class="card-body text-center">
                                <img src={process.env.REACT_APP_DOMAIN_URL + `/${avatar}`} alt="avatar" class="rounded-circle profileImage" />
                                <h5 class="my-3">{user.name}</h5>
                                <p class="text-muted mb-4">{user.city}</p>
                            </div>
                        </div>
                        <div className="card mb-4">
                            {manager.map((manager) =>
                                <div className="card-body text-center" key={manager._id}>
                                    <h5 className="my-3">Reporting To:</h5>
                                    <p>
                                        <img className="employeesImage" src={process.env.REACT_APP_DOMAIN_URL + `/${manager.avatar}`} alt="Manager" height="30px" width="30px" /> {manager.name}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div class="col-lg-8">
                        <div class="card mb-4">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-sm-3 my-2">
                                        <p class="mb-0">Full Name</p>
                                    </div>
                                    <div class="col-sm-9 my-2">
                                        <input type="text" class="form-control" id="name" name="name" onChange={handleChange} value={user.name} />
                                        {error.name && <p className="errorColor">{error.name}</p>}
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-3 my-2">
                                        <p class="mb-0">Email</p>
                                    </div>
                                    <div class="col-sm-9 my-2">
                                        <input type="text" class="form-control" id="email" name="email" onChange={handleChange} value={user.email} />
                                        {error.email && <p className='errorColor'>{error.email}</p>}
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-3 my-2">
                                        <p class="mb-0">Age</p>
                                    </div>
                                    <div class="col-sm-9 my-2">
                                        <input type="number" class="form-control" id="age" name="age" onChange={handleChange} value={user.age} />
                                        {error.age && <p className="errorColor">{error.age}</p>}
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-3 my-2">
                                        <p class="mb-0">Mobile</p>
                                    </div>
                                    <div class="col-sm-9 my-2">
                                        <input type="tel" class="form-control" id="mobile" name="mobile" onChange={handleChange} value={user.mobile} />
                                        {error.mobile && <p className="errorColor">{error.mobile}</p>}
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
                                        <p class="mb-0">address Line1</p>
                                    </div>
                                    <div class="col-sm-9 my-2">
                                        <input type="text" class="form-control" id="addressLine1" name="addressLine1" onChange={handleChange} value={user.addressLine1} />
                                        {error.addressLine1 && <p className="errorColor">{error.addressLine1}</p>}
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-3 my-2">
                                        <p class="mb-0">address Line2</p>
                                    </div>
                                    <div class="col-sm-9 my-2">
                                        <input type="text" class="form-control" id="addressLine2" name="addressLine2" onChange={handleChange} value={user.addressLine2} />
                                        {error.addressLine2 && <p className="errorColor">{error.addressLine2}</p>}
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-3 my-2">
                                        <p class="mb-0">city</p>
                                    </div>
                                    <div class="col-sm-9 my-2">
                                        <input type="text" class="form-control" id="city" name="city" onChange={handleChange} value={user.city} />
                                        {error.city && <p className="errorColor">{error.city}</p>}
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-3 my-2">
                                        <p class="mb-0">state</p>
                                    </div>
                                    <div class="col-sm-9 my-2">
                                        <input type="text" class="form-control" id="state" name="state" onChange={handleChange} value={user.state} />
                                        {error.state && <p className="errorColor">{error.state}</p>}
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-3 my-2">
                                        <p class="mb-0">country</p>
                                    </div>
                                    <div class="col-sm-9 my-2">
                                        <input type="text" class="form-control" id="country" name="country" onChange={handleChange} value={user.country} />
                                        {error.country && <p className="errorColor">{error.country}</p>}
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-3 my-2">
                                        <p class="mb-0">postal code</p>
                                    </div>
                                    <div class="col-sm-9 my-2">
                                        <input type="text" class="form-control" id="postalCode" name="postalCode" onChange={handleChange} value={user.postalCode} />
                                        {error.postalCode && <p className="errorColor">{error.postalCode}</p>}
                                    </div>
                                </div>
                                <button type="submit" class="btn btn-dark mx-2">Save</button>
                                <button class="btn btn-dark" onClick={navigateToProfile}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </>)
}

export default Edit;

