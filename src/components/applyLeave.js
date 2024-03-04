import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeLayout from "./employeeLayout";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { configureToastOptions } from "../core/services/toast-service";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import messages from "../core/constants/messages";
import leaveTrackerService from "../core/services/leaveTracker-service";
import decodeJwt from "../core/services/decodedJwtData-service";
import AdminLayout from "./adminLayout";
import Layout from "./layout";
import requestService from "../core/services/request-service";
import notificationService from '../core/services/notification-service';
import notificationMessage from "../core/constants/notification";

function ApplyLeave() {
    const navigate = useNavigate();
    const id = decodeJwt().id;
    const [error, setError] = useState({});
    const [leaveType, setLeaveType] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [totalDays, setTotalDays] = useState(0);
    const [reasonForLeave, setReasonForLeave] = useState({});
    const [managerId, setManagerId] = useState('');
    const [name, setName] = useState('')
    const [leaveError, setLeaveError] = useState('');
    const [employeeId, setEmployeeId] = useState(0);
    const [commonDates, setCommonDates] = useState([]);
    const [avatar, setAvatar] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await leaveTrackerService.loggedInUser();
                setManagerId(result.data[0].managerId);
                setName(result.data[0].name);
                setEmployeeId(result.data[0].employeeId);
                setAvatar(result.data[0].avatar);
                const requestData = await requestService.getRequestByStatus(id);
                const disabledDates = requestData.data.map((range) => {
                    return {
                        startDate: new Date(range.startDate),
                        endDate: new Date(range.endDate),
                    };
                });

                const allDaysBetweenStartAndEnd = [];
                let currentDate = new Date(startDate);
                while (currentDate <= endDate) {
                    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
                        allDaysBetweenStartAndEnd.push(new Date(currentDate));
                    }
                    currentDate.setDate(currentDate.getDate() + 1);
                }

                const allDisabledDays = disabledDates.reduce((acc, range) => {
                    let currentDate = new Date(range.startDate);
                    while (currentDate <= range.endDate) {
                        acc.push(new Date(currentDate));
                        currentDate.setDate(currentDate.getDate() + 1);
                    }
                    return acc;
                }, []);

                const commonDates = allDaysBetweenStartAndEnd.filter(date =>
                    allDisabledDays.some(disabledDate =>
                        date.getTime() === disabledDate.getTime()
                    )
                );

                setCommonDates(commonDates);

            } catch (error) {
                const toastOptions = configureToastOptions();
                toast.options = toastOptions;
                toast.error(error);
            }
        };

        fetchData();
    }, [startDate, endDate, id]);


    const validation = async () => {
        const error = {}
        if (!leaveType) {
            error.leaveType = messages.applyLeave.error.leaveTypeRequired;
        }

        if (!startDate) {
            error.startDateRequired = messages.applyLeave.error.startDateRequired;
        } else if (startDate > endDate) {
            error.startDateRequired = messages.applyLeave.error.startDateGreater;
        }

        if (!endDate) {
            error.endDateRequired = messages.applyLeave.error.endDateRequired;
        }

        if (!reasonForLeave.reasonForLeave) {
            error.reasonForLeave = messages.applyLeave.error.reasonForLeaveRequired;
        }

        setError(error);

        if (!leaveType || !startDate || !endDate || !reasonForLeave.reasonForLeave || startDate > endDate) {
            return true;
        }
    };

    const handleStartDateChange = (date) => {
        setStartDate(date);
        calculateTotalDays(date, endDate);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
        calculateTotalDays(startDate, date);
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

    const handleChange = (e) => {
        setReasonForLeave({ ...reasonForLeave, [e.target.name]: e.target.value });
    }

    const applyLeave = async (e) => {
        e.preventDefault();
        if (await validation()) {
            return;
        }

        if (commonDates.length > 0) {
            const formattedDates = commonDates.map(date => date.toLocaleDateString('en-GB'));
            setLeaveError(`Leave already applied for : [${formattedDates.join(', ')}]`);
            return;
        }

        try {
            const result = await leaveTrackerService.getParticularRecord({ userId: id, leaveId: leaveType });
            if ((result.data[0].balance - totalDays) < 0 && leaveType !== '659bc3c601e2f1640c262618' && leaveType !== '659bc3ae01e2f1640c262612' && leaveType !== '659bc3b501e2f1640c262614') {
                setLeaveError(`You have '${result.data[0].balance}' leaves available`);
                return
            } else {
                const formData = new FormData();
                formData.append('userId', id);
                formData.append('managerId', managerId);
                formData.append('leaveId', leaveType);
                formData.append('name', name);
                formData.append('employeeId', employeeId);
                formData.append('comment', reasonForLeave.reasonForLeav);
                formData.append('reasonForLeave', reasonForLeave.reasonForLeave);
                formData.append('startDate', startDate);
                formData.append('status', 0);
                formData.append('endDate', endDate);
                formData.append('totalDays', totalDays);
                formData.append('createdBy', id);
                formData.append('updatedBy', id);

                const requestData = await leaveTrackerService.applyLeaveRequest(formData);
                const notification = new FormData();
                notification.append('userId', managerId);
                notification.append('avatar', avatar);
                notification.append('addedByName', name);
                notification.append('leaveId', requestData.data._id);
                notification.append('message', notificationMessage.requestSent);
                notification.append('addedBy', id);
                notification.append('isSeen', false);
                notification.append('addedByEmployeeId', employeeId);

                await notificationService.createNotification(notification);
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

    const navigateToLeaveTracker = () => {
        navigate('/leaveTracker');
    }

    const filterWeekends = (date) => {
        const day = date.getDay();
        return day !== 0 && day !== 6;
    }

    return (
        <>
            <form action="#" method="post" onSubmit={applyLeave}>
                {decodeJwt().role === 'Employee' ? (
                    <EmployeeLayout />
                ) : decodeJwt().role === 'Manager' ? (
                    <Layout />
                ) : (
                    <AdminLayout />
                )}
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
                                                required
                                                value={leaveType} onChange={(e) => setLeaveType(e.target.value)} >
                                                <option>Select leave type</option>
                                                <option value="659bc36c01e2f1640c26260e">Compensantory Off</option>
                                                <option value="659bc3ae01e2f1640c262612">Forgot Id-Card</option>
                                                <option value="659bc3b501e2f1640c262614">Out Of Office On Duty</option>
                                                <option value="659bc3c101e2f1640c262616">Paid Leave</option>
                                                <option value="659bc3c601e2f1640c262618">Unpaid Leave</option>
                                                <option value="659bc3ce01e2f1640c26261a">Work From Home</option>
                                            </select>
                                            {error.leaveType && <p className="errorColor">{error.leaveType}</p>}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="form-label font-weight-bold">Start Date:</p>
                                            <br />
                                        </div>
                                        <div className="col-sm-9">
                                            <DatePicker
                                                selected={startDate}
                                                onChange={handleStartDateChange}
                                                selectsStart
                                                startDate={startDate}
                                                endDate={endDate}
                                                className="form-control"
                                                placeholderText="From"
                                                filterDate={filterWeekends}
                                                minDate={new Date()}
                                                showYearDropdown
                                                scrollableYearDropdown
                                                yearDropdownItemNumber={40}
                                            />
                                            {error.startDateRequired && <p className="errorColor">{error.startDateRequired}</p>}
                                            {error.startDate && <p className="errorColor">{error.startDate}</p>}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="form-label font-weight-bold">End Date:</p>
                                            <br />
                                        </div>
                                        <div className="col-sm-9">
                                            <DatePicker
                                                selected={endDate}
                                                onChange={handleEndDateChange}
                                                selectsEnd
                                                startDate={startDate}
                                                endDate={endDate}
                                                className="form-control"
                                                placeholderText="To"
                                                filterDate={filterWeekends}
                                                minDate={new Date()}
                                                showYearDropdown
                                                scrollableYearDropdown
                                                yearDropdownItemNumber={40}
                                            />
                                            {error.endDateRequired && <p className="errorColor">{error.endDateRequired}</p>}
                                            {error.endDate && <p className="errorColor">{error.endDate}</p>}
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
                                            <textarea class="form-control" id="reason" name="reasonForLeave" onChange={handleChange} placeholder="Enter reason for leave" />
                                            {error.reasonForLeave && <p className="errorColor">{error.reasonForLeave}</p>}
                                        </div>
                                    </div>
                                    <button type="submit" class="btn btn-dark m-2">Apply</button>
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