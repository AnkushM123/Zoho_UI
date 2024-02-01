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

function AddLeave() {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const jwtToken = localStorage.getItem('authToken');
    const [selectedUser, setSelectedUser] = useState('');
    const [totalDays, setTotalDays] = useState(0);
    const [error, setError] = useState({});

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
    }, [jwtToken]);

    const validation = async () => {
        const error = {};

        if (!selectedUser) {
            error.selectedUser = messages.addLeave.error.employeeRequired
        }

        if (!totalDays) {
            error.totalDays = messages.addLeave.error.daysRequired
        } else if (totalDays < 1) {
            error.totalDays = messages.addLeave.error.invalidDays
        }
        setError(error);

        if (!selectedUser || !totalDays || totalDays < 1) {
            return true;
        }
    }

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
            await leaveTrackerService.updateLeaveRecord(result.data[0].leaveId, leaveRecord, jwtToken);
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
        <div class="container py-5">
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <h4 className="my-3">Add Compensantory Leave:</h4>
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
                                        <option>select employee</option>
                                        {
                                            employees.map((user) =>
                                                <option value={user._id}>{user.employeeId}-{user.name}</option>
                                            )
                                        }
                                    </select>
                                    {error.selectedUser && <p style={{ color: "red" }}>{error.selectedUser}</p>}
                                </div>
                                <div className="row">
                                    <div className="col-sm-3">
                                        <p className="form-label font-weight-bold">Total Days:</p>
                                        <br />
                                    </div>
                                    <div className="col-sm-9">
                                        <input type="number" className="form-control" onChange={(e) => setTotalDays(e.target.value)} placeholder="enter number of days" />
                                        {error.totalDays && <p style={{ color: "red" }}>{error.totalDays}</p>}
                                    </div>
                                </div>
                            </div>
                            <button style={{ margin: "10px" }} type="submit" class="btn btn-dark" onClick={addLeave}>submit</button>
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