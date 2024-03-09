import { useState, useEffect } from "react"
import homeService from '../core/services/home-service';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';
import { configureToastOptions } from "../core/services/toast-service";
import decodeJwt from "../core/services/decodedJwtData-service";
import leaveTrackerService from "../core/services/leaveTracker-service";
import messages from "../core/constants/messages";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { useFormik } from "formik";
import "react-datepicker/dist/react-datepicker.css";
import profileService from "../core/services/profile-service";
import { addLeaveSchema } from "../core/validations/validations";

function AddLeave() {
    const inputData = {
        selectedUser: '', startDate: null, endDate: null, totalDays: 0, reasonForLeave: ''
    }
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const id = decodeJwt().id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await homeService();
                setEmployees(result.data);
            } catch (error) {
                const toastOptions = configureToastOptions();
                toast.options = toastOptions;
                toast.error(error);
            }
        };
        fetchData();
    }, []);

    const { values, errors, touched, handleBlur, handleSubmit, setFieldValue } = useFormik({
        initialValues: inputData,
        validationSchema: addLeaveSchema,
        onSubmit: async (values) => {
            try {
                const result = await leaveTrackerService.getParticularRecord({ userId: values.selectedUser, leaveId: '659bc36c01e2f1640c26260e' });
                const leaveRecord = {
                    userId: values.selectedUser,
                    balance: parseInt(result.data[0].balance) + parseInt(values.totalDays),
                    booked: result.data[0].booked,
                    updatedBy: decodeJwt().id
                }
                await leaveTrackerService.updateLeaveRecord('659bc36c01e2f1640c26260e', leaveRecord);
                const employeeDetailsResponse = await profileService.getManagerDetail(values.selectedUser);
                const formData = new FormData();
                formData.append('userId', values.selectedUser);
                formData.append('managerId', id);
                formData.append('leaveId', '659bc36c01e2f1640c26260e');
                formData.append('startDate', values.startDate);
                formData.append('endDate', values.endDate);
                formData.append('employeeId', employeeDetailsResponse.data[0].employeeId);
                formData.append('name', employeeDetailsResponse.data[0].name);
                formData.append('status', 3);
                formData.append('comment', 'undefined');
                formData.append('reasonForLeave', values.reasonForLeave);
                formData.append('totalDays', values.totalDays);
                formData.append('createdBy', id);
                formData.append('updatedBy', id);

                await leaveTrackerService.applyLeaveRequest(formData);
                setTimeout(function () {
                    const toastOptions = configureToastOptions();
                    toast.options = toastOptions;
                    toast.success(messages.addLeave.success.leaveAdded);
                });
                navigate('/home');
            } catch (error) {
                const toastOptions = configureToastOptions();
                toast.options = toastOptions;
                toast.error(error);
            }
        }
    })

    const handleStartDateChange = (date) => {
        setFieldValue('startDate', date);
        calculateWeekendDays(date, values.endDate);
    };

    const handleEndDateChange = (date) => {
        setFieldValue('endDate', date);
        calculateWeekendDays(values.startDate, date);
    };

    const calculateWeekendDays = (start, end) => {
        if (start && end) {
            let weekendDays = 0;
            let currentDate = new Date(start);

            while (currentDate <= end) {
                const dayOfWeek = currentDate.getDay();
                if (dayOfWeek === 0 || dayOfWeek === 6) {
                    weekendDays++;
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }
            setFieldValue('totalDays', weekendDays);
        }
    };

    const filterWeekdays = (date) => {
        const day = date.getDay();
        return day === 0 || day === 6;
    };

    const backToHome = () => {
        navigate('/home');
    }

    return (<>
        <div class="container py-4">
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <h4 className="my-3"><strong>Add Compensantory Leave:</strong></h4>
                    <div class="card mb-4">
                        <div class="card-body">
                            <div class="row mb-3">
                                <div class="col-sm-3 mb-2">
                                    <p class="form-label font-weight-bold">Employee Name:</p>
                                </div>
                                <div class="col-sm-9">
                                    <select className="form-control" id="selectedUser"
                                        name="selectedUser"
                                        required
                                        value={values.selectedUser} onChange={(e) => setFieldValue(e.target.value)} onBlur={handleBlur}>
                                        <option>Select employee</option>
                                        {
                                            employees.map((user) =>
                                                <option value={user._id}>{user.employeeId}-{user.name}</option>
                                            )
                                        }
                                    </select>
                                    {errors.selectedUser && touched.selectedUser ? <p className='errorColor'>{errors.selectedUser}</p> : null}
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-sm-3 mb-2">
                                    <p className="form-label font-weight-bold">Compensantory Off Days:</p>
                                </div>
                                <div className="col-sm-9">
                                    <DatePicker
                                        selected={values.startDate}
                                        onChange={handleStartDateChange}
                                        selectsStart
                                        startDate={values.startDate}
                                        endDate={values.endDate}
                                        className="form-control mb-3"
                                        placeholderText="From"
                                        minDate={new Date()}
                                        showYearDropdown
                                        scrollableYearDropdown
                                        yearDropdownItemNumber={40}
                                        filterDate={filterWeekdays}
                                        onBlur={handleBlur}
                                    />
                                    {errors.startDate && touched.startDate ? <p className='errorColor'>{errors.startDate}</p> : null}
                                    <DatePicker
                                        selected={values.endDate}
                                        onChange={handleEndDateChange}
                                        selectsEnd
                                        startDate={values.startDate}
                                        endDate={values.endDate}
                                        className="form-control"
                                        placeholderText="To"
                                        showYearDropdown
                                        scrollableYearDropdown
                                        yearDropdownItemNumber={40}
                                        filterDate={filterWeekdays}
                                        onBlur={handleBlur}
                                    />
                                    {errors.endDate && touched.endDate ? <p className='errorColor'>{errors.endDate}</p> : null}
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-sm-3 mb-2">
                                    <p className="form-label font-weight-bold">Total Days:</p>
                                </div>
                                <div className="col-sm-9">
                                    <input type="text" className="form-control" value={values.totalDays} readOnly />
                                    {errors.totalDays ? <p className='errorColor'>{errors.totalDays}</p> : null}
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-3 mb-2">
                                    <p class="form-label font-weight-bold">Reason:</p>
                                </div>
                                <div class="col-sm-9">
                                    <textarea class="form-control" id="reason" name="reasonForLeave" value={values.reasonForLeave} onChange={(e) => setFieldValue(e.target.value)} placeholder="Enter reason" onBlur={handleBlur} />
                                    {errors.reasonForLeave && touched.reasonForLeave ? <p className='errorColor'>{errors.reasonForLeave}</p> : null}
                                </div>
                            </div>
                            <button type="submit" class="btn btn-dark m-2" onClick={handleSubmit}>Submit</button>
                            <button class="btn btn-dark" onClick={backToHome}>Back</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}

export default AddLeave;