import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { configureToastOptions } from "../core/services/toast-service";
import requestService from "../core/services/request-service";
import decodeJwt from "../core/services/decodedJwtData-service";
import { useParams } from 'react-router-dom';
import Layout from "./layout";
import leaveTrackerService from "../core/services/leaveTracker-service";
import EmployeeLayout from "./employeeLayout";
import AdminLayout from "./adminLayout";
import leaveTypeService from '../core/services/leaveType-service';

function RequestDetails() {
    const navigate = useNavigate();
    const jwtToken = localStorage.getItem('authToken');
    const { requestId } = useParams();
    const [request, setRequest] = useState({});
    const [comment, setComment] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await requestService.getByRequestId(requestId, jwtToken);
                setRequest(result.data[0]);
            } catch (error) {
                const toastOptions = configureToastOptions();
                toast.options = toastOptions;
                toast.error(error);
            }
        }
        fetchData();
    }, [jwtToken, requestId]);

    const handleChange = (e) => {
        setComment({ ...comment, [e.target.name]: e.target.value });
        console.log(comment)
    }

    const convertToDate = (timestamp) => {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${day}/${month}/${year}`;
    }

    const getLeaveTypeById = async (id) => {
        const result = await leaveTypeService(id, jwtToken);
        return result.data.leaveName;
    };

    const changeRequestStatus = async () => {
        try {
            await requestService.changeRequestStatus(request._id, { status: "Approved" }, jwtToken);
            await requestService.addCommentInRequest(request._id, comment, jwtToken);
            const result = await leaveTrackerService.getParticularRecord({ userId: request.userId, leaveId: request.leaveId }, jwtToken);
            const leaveRecord = {
                userId: request.userId,
                balance: result.data[0].balance - request.totalDays,
                booked: result.data[0].booked + request.totalDays,
                updatedBy: request.userId
            }
            await leaveTrackerService.updateLeaveRecord(result.data[0].leaveId, leaveRecord, jwtToken);
            navigate('/request')
        } catch (error) {
            const toastOptions = configureToastOptions();
            toast.options = toastOptions;
            toast.error(error);
        }
    }

    const declineRequest = async () => {
        try {
            await requestService.changeRequestStatus(request._id, { status: "Rejected" }, jwtToken);
            await requestService.addCommentInRequest(request._id, comment, jwtToken);
            navigate('/request')
        } catch (error) {
            const toastOptions = configureToastOptions();
            toast.options = toastOptions;
            toast.error(error);
        }
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
                    <div class="card mb-4">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-sm-3">
                                    <p class="form-label font-weight-bold">Employee No:</p>
                                    <br></br>
                                </div>
                                <div class="col-sm-9">
                                    <p class="text-muted mb-0">{request.employeeId}</p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-3">
                                    <p class="form-label font-weight-bold">Name:</p>
                                    <br></br>
                                </div>
                                <div class="col-sm-9">
                                    <p class="text-muted mb-0">{request.name}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-3">
                                    <p className="form-label font-weight-bold">From-To:</p>
                                    <br />
                                </div>
                                <div className="col-sm-9">
                                    <p class="text-muted mb-0">{convertToDate(request.startDate)} - {convertToDate(request.endDate)}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-3">
                                    <p className="form-label font-weight-bold">Total Days:</p>
                                    <br />
                                </div>
                                <div className="col-sm-9">
                                    <p class="text-muted mb-0">{request.totalDays}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-3">
                                    <p className="form-label font-weight-bold">Leave Type:</p>
                                    <br />
                                </div>
                                <div className="col-sm-9">
                                    <p class="text-muted mb-0">{getLeaveTypeById(request.leaveId)}</p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-3">
                                    <p class="form-label font-weight-bold">Reason For Leave:</p>
                                    <br></br>
                                </div>
                                <div class="col-sm-9">
                                    <p class="text-muted mb-0">{request.reasonForLeave}</p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-3">
                                    <p class="form-label font-weight-bold">Comment:</p>
                                    <br></br>
                                </div>
                                <div class="col-sm-9">
                                    <textarea class="form-control" id="comment" name="comment" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="py-2">
                                <button type="submit" class="btn btn-success m-2" onClick={changeRequestStatus}>Approve</button>
                                <button class="btn btn-danger" onClick={declineRequest}>Rejected</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}

export default RequestDetails;