import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { configureToastOptions } from "../core/services/toast-service";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import messages from "../core/constants/messages";
import leaveTrackerService from "../core/services/leaveTracker-service";
import decodeJwt from "../core/services/decodedJwtData-service";
import { useFormik } from "formik";
import { applyLeaveSchema } from "../core/validations/validations";

function ApplyLeave() {
    const inputData = {
        leaveType: '', startDate: null, endDate: null, reasonForLeave: ''
    }
    const navigate = useNavigate();
    const id = decodeJwt().id;
    const jwtToken = localStorage.getItem('authToken');
    const [totalDays, setTotalDays] = useState(0);
    const [managerId, setManagerId] = useState('');
    const [name, setName] = useState('')
    const [leaveError, setLeaveError] = useState('');
    const [leaveName, setLeaveName] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await leaveTrackerService.loggedInUser(jwtToken);
                setManagerId(result.data[0].managerId);
                setName(result.data[0].name);
            } catch (error) {
                const toastOptions = configureToastOptions();
                toast.options = toastOptions;
                toast.error(error);
            }
        }
        fetchData();
    }, [jwtToken])

    const { values, errors, touched, handleBlur, setFieldValue, handleSubmit } = useFormik({
        initialValues: inputData,
        validationSchema: applyLeaveSchema,
        onSubmit: async (values) => {
            try {
                const result = await leaveTrackerService.getParticularRecord({ userId: id, leaveId: values.leaveType }, jwtToken);
                if ((result.data[0].balance - totalDays) < 0 && values.leaveType !== '659bc3c601e2f1640c262618') {
                    setLeaveError(`You have '${result.data[0].balance}' leaves available`);
                    return
                } else {
                    const leaveRecord = {
                        userId: id,
                        balance: Math.abs(result.data[0].balance - totalDays),
                        updatedBy: id
                    }
                    await leaveTrackerService.updateLeaveRecord(result.data[0].leaveId, leaveRecord, jwtToken);
                    const formData = new FormData();
                    formData.append('userId', id);
                    formData.append('managerId', managerId);
                    formData.append('leaveId', values.leaveType);
                    formData.append('name', name);
                    formData.append('leaveName', leaveName);
                    formData.append('reasonForLeave', values.reasonForLeave);
                    formData.append('startDate', values.startDate);
                    formData.append('endDate', values.endDate);
                    formData.append('totalDays', totalDays);
                    formData.append('createdBy', id);
                    formData.append('updatedBy', id);

                    await leaveTrackerService.applyLeaveRequest(formData, jwtToken);
                    setTimeout(function () {
                        const toastOptions = configureToastOptions();
                        toast.options = toastOptions;
                        toast.success(messages.applyLeave.success.requestSuccess);
                    });
                    navigate('/leaveTracker')
                }
            } catch (error) {
                const toastOptions = configureToastOptions();
                toast.options = toastOptions;
                toast.error(error);
            }
        }
    })

    const handleChange = (e) => {
        setFieldValue('reasonForLeave', e.target.value);
        switch (values.leaveType) {
            case '659bc36c01e2f1640c26260e':
                setLeaveName('Compensantory Leave');
                break;
            case '659bc3ae01e2f1640c262612':
                setLeaveName('Forgot IDCard');
                break;
            case '659bc3b501e2f1640c262614':
                setLeaveName('Out Of Office OnDuty');
                break;
            case '659bc3c101e2f1640c262616':
                setLeaveName('Paid Leave');
                break;
            case '659bc3c601e2f1640c262618':
                setLeaveName('Unpaid Leave');
                break;
            case '659bc3ce01e2f1640c26261a':
                setLeaveName('Work From Home');
                break;
            default:
                break;
        }
    }

    const handleStartDateChange = (date) => {
        setFieldValue('startDate', date);
        calculateTotalDays(date, values.endDate);
    };

    const handleEndDateChange = (date) => {
        setFieldValue('endDate', date);
        calculateTotalDays(values.startDate, date);
    };

    const calculateTotalDays = (start, end) => {
        if (start && end) {
            const daysDiff = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
            const totalDaysExcludingWeekends = calculateTotalDaysExcludingWeekends(start, daysDiff);
            setTotalDays(totalDaysExcludingWeekends);
        }
    };

    const calculateTotalDaysExcludingWeekends = (startDate, days) => {
        let totalDays = 0;
        let currentDate = new Date(startDate);

        for (let i = 0; i < days; i++) {
            const dayOfWeek = currentDate.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                totalDays++;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return totalDays;
    };

    const navigateToLeaveTracker = () => {
        navigate('/leaveTracker');
    }

    return (
        <>
            <form action="#" method="post" onSubmit={handleSubmit}>
                <div class="container py-5">
                    <div class="row justify-content-center">
                        <div class="col-lg-8">
                            <div class="card mb-4">
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-sm-3">
                                            <p class="form-label font-weight-bold">Leave Type:</p>
                                            <br></br>
                                        </div>
                                        <div class="col-sm-9">
                                            <select class="form-select" id="leaveType"
                                                name="leaveType"
                                                value={values.leaveType} onChange={(e) => setFieldValue('leaveType', e.target.value)} onBlur={handleBlur}>
                                                <option value=''>select leave type</option>
                                                <option value="659bc36c01e2f1640c26260e">Compensantory Off</option>
                                                <option value="659bc3ae01e2f1640c262612">ForgotId Card</option>
                                                <option value="659bc3b501e2f1640c262614">Out Of Office On Duty</option>
                                                <option value="659bc3c101e2f1640c262616">Paid Leave</option>
                                                <option value="659bc3c601e2f1640c262618">Unpaid Leave</option>
                                                <option value="659bc3ce01e2f1640c26261a">Work From Home</option>
                                            </select>
                                            {errors.leaveType && touched.leaveType ? <p className="errorColor">{errors.leaveType}</p> : null}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="form-label font-weight-bold">Start Date:</p>
                                            <br />
                                        </div>
                                        <div className="col-sm-9">
                                            <DatePicker
                                                selected={values.startDate}
                                                onChange={handleStartDateChange}
                                                selectsStart
                                                startDate={values.startDate}
                                                endDate={values.endDate}
                                                className="form-control"
                                                onBlur={handleBlur}
                                            />
                                            {errors.startDate && touched.startDate ? <p className="errorColor">{errors.startDate}</p> : null}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="form-label font-weight-bold">End Date:</p>
                                            <br />
                                        </div>
                                        <div className="col-sm-9">
                                            <DatePicker
                                                selected={values.endDate}
                                                onChange={handleEndDateChange}
                                                selectsEnd
                                                startDate={values.startDate}
                                                endDate={values.endDate}
                                                minDate={values.startDate}
                                                className="form-control"
                                                onBlur={handleBlur}
                                            />
                                            {errors.endDate && touched.endDate ? <p className="errorColor">{errors.endDate}</p> : null}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="form-label font-weight-bold">Total Days:</p>
                                            <br />
                                        </div>
                                        <div className="col-sm-9">
                                            <input type="text" className="form-control" value={totalDays} readOnly />
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-sm-3">
                                            <p class="form-label font-weight-bold">Reason For Leave:</p>
                                            <br></br>
                                        </div>
                                        <div class="col-sm-9">
                                            <textarea class="form-control" id="reason" name="reasonForLeave" value={values.reasonForLeave} onChange={handleChange} onBlur={handleBlur} />
                                            {errors.reasonForLeave && touched.reasonForLeave ? <p className="errorColor">{errors.reasonForLeave}</p> : null}
                                        </div>
                                    </div>
                                    <button type="submit" class="btn btn-dark mx-2">Apply</button>
                                    <button class="btn btn-dark" onClick={navigateToLeaveTracker}>Back</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <center>
                        {leaveError && <p className="errorColor">{leaveError}</p>}
                    </center>
                </div>
            </form>
        </>
    )
}

export default ApplyLeave;