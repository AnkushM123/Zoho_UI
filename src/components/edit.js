import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import profileService from '../core/services/profile-service';
import { configureToastOptions } from "../core/services/toast-service";
import messages from "../core/constants/messages";
import updateService from '../core/services/update-service';
import { useFormik } from "formik";
import { editSchema } from '../core/validations/validations';

function Edit() {
    const navigate = useNavigate();
    const [user, setUser] = useState({ 'name': '', 'age': '', 'mobile': '', 'email': '', 'addressLine1': '', 'addressLine2': '', 'city': '', 'state': '', 'country': '', 'postalCode': '' });
    const [avatar, setAvatar] = useState('');
    const jwtToken = localStorage.getItem('authToken');
    const [manager, setManager] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await profileService.loggedInUser(jwtToken);
                result.data.map(async (userData) => {
                    setUser({
                        'name': userData.name,
                        'age': userData.age,
                        'mobile': userData.mobile,
                        'email': userData.email,
                        'addressLine1': userData.address.addressLine1,
                        'addressLine2': userData.address.addressLine2,
                        'city': userData.address.city,
                        'state': userData.address.state,
                        'country': userData.address.country,
                        'postalCode': userData.address.postalCode,
                    });

                    setAvatar(userData.avatar);
                    const managerDetailsResponse = await profileService.getManagerDetail(userData.managerId, jwtToken);
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
    }, [])

    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
        initialValues: user,
        validationSchema: editSchema,
        enableReinitialize: true,

        onSubmit: async (values) => {
            const id = localStorage.getItem('id');
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('age', values.age);
            formData.append('mobile', values.mobile);
            formData.append('email', values.email);
            formData.append('updatedBy', id);
            formData.append('address[addressLine1]', values.addressLine1);
            formData.append('address[addressLine2]', values.addressLine2);
            formData.append('address[city]', values.city);
            formData.append('address[state]', values.state);
            formData.append('address[country]', values.country);
            formData.append('address[postalCode]', values.postalCode);

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
    })

    return (<>
        <form action="#" method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
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
                                        <input type="text" class="form-control" id="name" name="name" value={values.name} onChange={handleChange} onBlur={handleBlur} />
                                        {errors.name && touched.name ? <p className="errorColor">{errors.name}</p> : null}
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-3 my-2">
                                        <p class="mb-0">Email</p>
                                    </div>
                                    <div class="col-sm-9 my-2">
                                        <input type="text" class="form-control" id="email" name="email" onChange={handleChange} value={values.email} onBlur={handleBlur} />
                                        {errors.email && touched.email ? <p className='errorColor'>{errors.email}</p> : null}
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-3 my-2">
                                        <p class="mb-0">Age</p>
                                    </div>
                                    <div class="col-sm-9 my-2">
                                        <input type="number" class="form-control" id="age" name="age" onChange={handleChange} value={values.age} onBlur={handleBlur} />
                                        {errors.age && touched.age ? <p className="errorColor">{errors.age}</p> : null}
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-3 my-2">
                                        <p class="mb-0">Mobile</p>
                                    </div>
                                    <div class="col-sm-9 my-2">
                                        <input type="tel" class="form-control" id="mobile" name="mobile" onChange={handleChange} value={values.mobile} onBlur={handleBlur} />
                                        {errors.mobile && touched.mobile ? <p className="errorColor">{errors.mobile}</p> : null}
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
                                        <input type="text" class="form-control" id="addressLine1" name="addressLine1" onChange={handleChange} value={values.addressLine1} onBlur={handleBlur} />
                                        {errors.addressLine1 && touched.addressLine1 ? <p className="errorColor">{errors.addressLine1}</p> : null}
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-3 my-2">
                                        <p class="mb-0">address Line2</p>
                                    </div>
                                    <div class="col-sm-9 my-2">
                                        <input type="text" class="form-control" id="addressLine2" name="addressLine2" onChange={handleChange} value={values.addressLine2} onBlur={handleBlur} />
                                        {errors.addressLine2 && touched.addressLine2 ? <p className="errorColor">{errors.addressLine2}</p> : null}
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-3 my-2">
                                        <p class="mb-0">city</p>
                                    </div>
                                    <div class="col-sm-9 my-2">
                                        <input type="text" class="form-control" id="city" name="city" onChange={handleChange} value={values.city} onBlur={handleBlur} />
                                        {errors.city && touched.city ? <p className="errorColor">{errors.city}</p> : null}
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-3 my-2">
                                        <p class="mb-0">state</p>
                                    </div>
                                    <div class="col-sm-9 my-2">
                                        <input type="text" class="form-control" id="state" name="state" onChange={handleChange} value={values.state} onBlur={handleBlur} />
                                        {errors.state && touched.state ? <p className="errorColor">{errors.state}</p> : null}
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-3 my-2">
                                        <p class="mb-0">country</p>
                                    </div>
                                    <div class="col-sm-9 my-2">
                                        <input type="text" class="form-control" id="country" name="country" onChange={handleChange} value={values.country} onBlur={handleBlur} />
                                        {errors.country && touched.country ? <p className="errorColor">{errors.country}</p> : null}
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-3 my-2">
                                        <p class="mb-0">postal code</p>
                                    </div>
                                    <div class="col-sm-9 my-2">
                                        <input type="text" class="form-control" id="postalCode" name="postalCode" onChange={handleChange} value={values.postalCode} onBlur={handleBlur} />
                                        {errors.postalCode && <p className="errorColor">{errors.postalCode}</p>}
                                    </div>
                                </div>
                                <button type="submit" class="btn btn-dark mx-2">Save</button>
                                <button class="btn btn-dark" onClick={() => navigate('/profile')}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </>)
}

export default Edit;

