import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import profileService from '../core/services/profile-service';
import { configureToastOptions } from "../core/services/toast-service";
import messages from "../core/constants/messages";
import updateService from '../core/services/update-service';
import decodeJwt from "../core/services/decodedJwtData-service";
import defaultUser from './user_3177440.png';
import React, { useRef } from 'react';
import { useFormik } from "formik";
import { editSchema } from '../core/validations/validations';

function Edit() {
    const navigate = useNavigate();
    const [user, setUser] = useState({ 'name': '', 'mobile': '', 'addressLine1': '', 'addressLine2': '', 'city': '', 'state': '', 'country': '', 'postalCode': '' });
    const [avatar, setAvatar] = useState('');
    const [fileError, setFileError] = useState()
    const [manager, setManager] = useState([]);
    const id = decodeJwt().id;
    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const fileInputRef = useRef(null);
    const [isFileImage, setIsFileImage] = useState(true);
    const [file, setFile] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await profileService.loggedInUser();
                result.data.map(async (user) => {
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
                    setFile(user.avatar);
                    setCity(user.address.city);
                    setName(user.name);
                    if (decodeJwt().role !== 'Admin') {
                        const managerDetailsResponse = await profileService.getManagerDetail(user.managerId);
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
    }, [])

    const handleUploadClick = (e) => {
        e.preventDefault();
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const fileType = selectedFile.type.split('/')[0];
            if (fileType === 'image') {
                setIsFileImage(true);
                setFileError('');
            } else {
                setIsFileImage(false);
            }
        }
        setFile(selectedFile);
    };

    const { values, errors, touched, handleBlur, handleSubmit, handleChange } = useFormik({
        initialValues: user,
        validationSchema: editSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            if (isFileImage === false) {
                setFileError(messages.register.error.fileValidation);
                return;
            }
            const address = {
                'addressLine1': values.addressLine1,
                'addressLine2': values.addressLine2,
                'city': values.city,
                'state': values.state,
                'country': values.country,
                'postalCode': values.postalCode,
            }

            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('mobile', values.mobile);
            formData.append('avatar', file);
            formData.append('updatedBy', id);
            formData.append('address', JSON.stringify(address));

            try {
                await updateService.updateUser(id, formData);
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

    const handleImageError = (event) => {
        event.target.src = defaultUser;
        event.target.onerror = null;
    };

    return (
        <>
            <form action="#" method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
                <div class="container py-5">
                    <div class="row">
                        <div class="col-lg-4">
                            <div class="card mb-4">
                                <div class="card-body text-center">
                                    <img src={process.env.REACT_APP_DOMAIN_URL + `/${avatar}`} alt="avatar"
                                        className="rounded-circle profileImage my-1" onError={handleImageError} />
                                    <div>
                                        <button onClick={handleUploadClick}>Upload Image</button>
                                        <input
                                            className='uploadImage'
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            accept="image/png, image/gif, image/jpeg"
                                        />
                                    </div>
                                    {fileError && <p className='errorColor'>{fileError}</p>}
                                    <h5 class="my-3">{name}</h5>
                                    <p class="text-muted mb-4">{city}</p>
                                </div>
                            </div>
                            {manager.length !== 0 && <div className="card mb-4">
                                {manager.map((manager) =>
                                    <div className="card-body text-center" key={manager._id}>
                                        <h5 className="my-3">Reporting To:</h5>
                                        <p>
                                            <img
                                                className="image"
                                                src={process.env.REACT_APP_DOMAIN_URL + `/${manager.avatar}`}
                                                alt="Employee"
                                                height="30px"
                                                width="30px"
                                                onError={handleImageError}
                                            />  {manager.employeeId}-<span className="font-weight-bold">{manager.name}</span>
                                        </p>
                                    </div>
                                )}
                            </div>
                            }
                        </div>
                        <div class="col-lg-8">
                            <div class="card mb-4">
                                <div class="card-body">
                                    <div class="row mb-3">
                                        <div class="col-sm-3">
                                            <p class="mb-0">Full Name</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <input type="text" class="form-control" id="name" name="name" onChange={handleChange} value={values.name} onBlur={handleBlur} />
                                            {errors.name && touched.name ? <p className='errorColor'>{errors.name}</p> : null}
                                        </div>
                                    </div>
                                    <div class="row mb-3">
                                        <div class="col-sm-3">
                                            <p class="mb-0">Mobile</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <input type="tel" class="form-control" id="mobile" name="mobile" onChange={handleChange} value={values.mobile} onBlur={handleBlur} />
                                            {errors.mobile && touched.mobile ? <p className='errorColor'>{errors.mobile}</p> : null}
                                        </div>
                                    </div>
                                    <div class="row mb-3">
                                        <div class="col-sm-3">
                                            <p class="mb-0 font-weight-bold">Address:</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <p class="text-muted mb-0"></p>
                                        </div>
                                    </div>
                                    <div class="row mb-3">
                                        <div class="col-sm-3">
                                            <p class="mb-0">Address Line 1</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <input type="text" class="form-control" id="addressLine1" name="addressLine1" onChange={handleChange} value={values.addressLine1} onBlur={handleBlur} />
                                            {errors.addressLine1 && touched.addressLine1 ? <p className='errorColor'>{errors.addressLine1}</p> : null}
                                        </div>
                                    </div>
                                    <div class="row mb-3">
                                        <div class="col-sm-3">
                                            <p class="mb-0">Address Line 2</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <input type="text" class="form-control" id="addressLine2" name="addressLine2" onChange={handleChange} value={values.addressLine2} onBlur={handleBlur} />
                                            {errors.addressLine2 && touched.addressLine2 ? <p className='errorColor'>{errors.addressLine2}</p> : null}
                                        </div>
                                    </div>
                                    <div class="row mb-3">
                                        <div class="col-sm-3">
                                            <p class="mb-0">City</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <input type="text" class="form-control" id="city" name="city" onChange={handleChange} value={values.city} onBlur={handleBlur} />
                                            {errors.city && touched.city ? <p className='errorColor'>{errors.city}</p> : null}
                                        </div>
                                    </div>
                                    <div class="row mb-3">
                                        <div class="col-sm-3">
                                            <p class="mb-0">State</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <input type="text" class="form-control" id="state" name="state" onChange={handleChange} value={values.state} onBlur={handleBlur} />
                                            {errors.state && touched.state ? <p className='errorColor'>{errors.state}</p> : null}
                                        </div>
                                    </div>
                                    <div class="row mb-3">
                                        <div class="col-sm-3">
                                            <p class="mb-0">Country</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <input type="text" class="form-control" id="country" name="country" onChange={handleChange} value={values.country} onBlur={handleBlur} />
                                            {errors.country && touched.country ? <p className='errorColor'>{errors.country}</p> : null}
                                        </div>
                                    </div>
                                    <div class="row mb-3">
                                        <div class="col-sm-3">
                                            <p class="mb-0">Postal Code</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <input type="text" class="form-control" id="postalCode" name="postalCode" onChange={handleChange} value={values.postalCode} onBlur={handleBlur} />
                                            {errors.postalCode && touched.postalCode ? <p className='errorColor'>{errors.postalCode}</p> : null}
                                        </div>
                                    </div>
                                    <button type='submit' class="btn btn-dark m-2">Save</button>
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