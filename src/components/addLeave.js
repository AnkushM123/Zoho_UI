import Layout from "./layout"
import { useState, useEffect } from "react"
import homeService from '../core/services/home-service';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';
import { configureToastOptions } from "../core/services/toast-service";
import EmployeeLayout from "./employeeLayout";
import decodeJwt from "../core/services/decodedJwtData-service";
import leaveTrackerService from "../core/services/leaveTracker-service";
import messages from "../core/constants/messages";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./adminLayout";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import profileService from "../core/services/profile-service";

function AddLeave() {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [error, setError] = useState({});
    const id = decodeJwt().id;
    const jwtToken = localStorage.getItem('authToken');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [totalDays, setTotalDays] = useState(0);
    const [reasonForLeave, setReasonForLeave] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await homeService(jwtToken);
                setEmployees(result.data);
            } catch (error) {
                const toastOptions = configureToastOptions();
                toast.options = toastOptions;
                toast.error(error);
            }
        };
        fetchData();
    }, []);

    const validation = async () => {
        const error = {};

        if (!selectedUser) {
            error.selectedUser = messages.addLeave.error.employeeRequired;
        }

        if (!startDate) {
            error.startDateRequired = messages.addLeave.error.startDateRequired;
        } else if (startDate > endDate) {
            error.startDateRequired = messages.addLeave.error.startDateGreater;
        }

        if (!endDate) {
            error.endDateRequired = messages.addLeave.error.endDateRequired;
        }

        if (totalDays > 20) {
            error.totalDays = messages.addLeave.error.daysRange;
        }

        if (!reasonForLeave) {
            error.reasonForLeave = messages.applyLeave.error.reasonForLeaveRequired;
        }

        setError(error);

        if (!selectedUser || !totalDays || totalDays < 1 || !reasonForLeave) {
            return true;
        }
    }

    const handleStartDateChange = (date) => {
        setStartDate(date);
        calculateWeekendDays(date, endDate);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
        calculateWeekendDays(startDate, date);
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
            setTotalDays(weekendDays);
        }
    };

    const filterWeekdays = (date) => {
        const day = date.getDay();
        return day === 0 || day === 6;
    };

    const addLeave = async () => {
        if (await validation()) {
            return;
        }
        try {
            const result = await leaveTrackerService.getParticularRecord({ userId: selectedUser, leaveId: '659bc36c01e2f1640c26260e' }, jwtToken);
            const leaveRecord = {
                userId: selectedUser,
                balance: parseInt(result.data[0].balance) + parseInt(totalDays),
                booked: result.data[0].booked,
                updatedBy: decodeJwt().id
            }
            await leaveTrackerService.updateLeaveRecord('659bc36c01e2f1640c26260e', leaveRecord, jwtToken);
            const employeeDetailsResponse = await profileService.getManagerDetail(selectedUser, jwtToken);
            const formData = new FormData();
            formData.append('userId', selectedUser);
            formData.append('managerId', id);
            formData.append('leaveId', '659bc36c01e2f1640c26260e');
            formData.append('startDate', startDate);
            formData.append('endDate', endDate);
            formData.append('employeeId', employeeDetailsResponse.data[0].employeeId);
            formData.append('name', employeeDetailsResponse.data[0].name);
            formData.append('status', 3);
            formData.append('comment', 'undefined');
            formData.append('reasonForLeave', reasonForLeave);
            formData.append('totalDays', totalDays);
            formData.append('createdBy', id);
            formData.append('updatedBy', id);

            await leaveTrackerService.applyLeaveRequest(formData, jwtToken);
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

    const backToHome = () => {
        navigate('/home');
    }

    return (<>

        {decodeJwt().role === 'Employee' ? (
            <EmployeeLayout />
        ) : decodeJwt().role === 'Manager' ? (
            <Layout />
        ) : (
            <AdminLayout />
        )}
        <div class="container py-4">
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <h4 className="my-3"><strong>Add Compensantory Leave:</strong></h4>
                    <div class="card mb-4">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-sm-3">
                                    <p class="form-label font-weight-bold">Employee Name:</p>
                                    <br></br>
                                </div>
                                <div class="col-sm-9">
                                    <select className="form-control" id="selectedUser"
                                        name="selectedUser"
                                        required
                                        value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} >
                                        <option>Select employee</option>
                                        {
                                            employees.map((user) =>
                                                <option value={user._id}>{user.employeeId}-{user.name}</option>
                                            )
                                        }
                                    </select>
                                    {error.selectedUser && <p className="errorColor">{error.selectedUser}</p>}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-3">
                                    <p className="form-label font-weight-bold">Compensantory Off Days:</p>
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
                                        minDate={new Date()}
                                        showYearDropdown
                                        scrollableYearDropdown
                                        yearDropdownItemNumber={40}
                                        filterDate={filterWeekdays}
                                    />
                                    {error.startDateRequired && <p className="errorColor">{error.startDateRequired}</p>}
                                    <br></br>
                                    <DatePicker
                                        selected={endDate}
                                        onChange={handleEndDateChange}
                                        selectsEnd
                                        startDate={startDate}
                                        endDate={endDate}
                                        className="form-control"
                                        placeholderText="To"
                                        showYearDropdown
                                        scrollableYearDropdown
                                        yearDropdownItemNumber={40}
                                        filterDate={filterWeekdays}
                                    />
                                    {error.endDateRequired && <p className="errorColor">{error.endDateRequired}</p>}
                                </div>
                            </div>
                            <br></br>
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
                                    <p class="form-label font-weight-bold">Reason:</p>
                                    <br></br>
                                </div>
                                <div class="col-sm-9">
                                    <textarea class="form-control" id="reason" name="reasonForLeave" onChange={(e) => setReasonForLeave(e.target.value)} placeholder="Enter reason" />
                                    {error.reasonForLeave && <p className="errorColor">{error.reasonForLeave}</p>}
                                </div>
                            </div>
                            <button type="submit" class="btn btn-dark m-2" onClick={addLeave}>Submit</button>
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