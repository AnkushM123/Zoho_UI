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

function ApplyLeave() {
    const navigate = useNavigate();
    const id = decodeJwt().id;
    const jwtToken = localStorage.getItem('authToken');
    const [error, setError] = useState({});
    const [leaveType, setLeaveType] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [totalDays, setTotalDays] = useState(0);
    const [reasonForLeave, setReasonForLeave] = useState({});
    const [managerId, setManagerId] = useState('');
    const [name, setName] = useState('')
    const [leaveError, setLeaveError] = useState('');
    const [leaveName, setLeaveName] = useState('');
    const [employeeId, setEmployeeId] = useState(0)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await leaveTrackerService.loggedInUser(jwtToken);
                setManagerId(result.data[0].managerId);
                setName(result.data[0].name);
                setEmployeeId(result.data[0].employeeId)
            } catch (error) {
                const toastOptions = configureToastOptions();
                toast.options = toastOptions;
                toast.error(error);
            }
        }
        fetchData();
    }, [jwtToken])

    const validation = async () => {
        const error = {}
        if (!leaveType) {
            error.leaveType = messages.applyLeave.error.leaveTypeRequired;
        }

        if (!startDate) {
            error.startDate = messages.applyLeave.error.startDateRequired;
        } else if (startDate > endDate) {
            error.startDate = messages.applyLeave.error.startDateGreater;
        }

        if (!endDate) {
            error.endDate = messages.applyLeave.error.endDateRequired;
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
        switch (leaveType) {
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

    const applyLeave = async (e) => {
        e.preventDefault();
        if (await validation()) {
            return;
        }
        try {
            const result = await leaveTrackerService.getParticularRecord({ userId: id, leaveId: leaveType }, jwtToken);
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
                formData.append('leaveName', leaveName);
                formData.append('comment', reasonForLeave.reasonForLeav);
                formData.append('reasonForLeave', reasonForLeave.reasonForLeave);
                formData.append('startDate', startDate);
                formData.append('endDate', endDate);
                formData.append('totalDays', totalDays);
                formData.append('createdBy', id);
                formData.append('updatedBy', id);

                const leaveRequest = await leaveTrackerService.applyLeaveRequest(formData, jwtToken);
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
                                                <option>select leave type</option>
                                                <option value="659bc36c01e2f1640c26260e">Compensantory Off</option>
                                                <option value="659bc3ae01e2f1640c262612">Forgot Id-Card</option>
                                                <option value="659bc3b501e2f1640c262614">Out Of Office On Duty</option>
                                                <option value="659bc3c101e2f1640c262616">Paid Leave</option>
                                                <option value="659bc3c601e2f1640c262618">Unpaid Leave</option>
                                                <option value="659bc3ce01e2f1640c26261a">Work From Home</option>
                                            </select>
                                            {error.leaveType && <p style={{ color: "red" }}>{error.leaveType}</p>}
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
                                            />
                                            {error.startDate && <p style={{ color: "red" }}>{error.startDate}</p>}
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
                                                minDate={startDate}
                                                className="form-control"
                                                placeholderText="To"
                                            />
                                            {error.endDate && <p style={{ color: "red" }}>{error.endDate}</p>}
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
                                            {error.reasonForLeave && <p style={{ color: "red" }}>{error.reasonForLeave}</p>}
                                        </div>
                                    </div>
                                    <button style={{ margin: "10px" }} type="submit" class="btn btn-dark">Apply</button>
                                    <button class="btn btn-dark" onClick={navigateToLeaveTracker}>Back</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <center>
                        {leaveError && <p style={{ color: "red" }}>{leaveError}</p>}
                    </center>
                </div>
            </form>
        </>
    )
}

export default ApplyLeave;