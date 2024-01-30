import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { configureToastOptions } from "../core/services/toast-service";
import messages from "../core/constants/messages";
import requestService from "../core/services/request-service";
import decodeJwt from "../core/services/decodedJwtData-service";
import { useParams } from 'react-router-dom';
import Layout from "./layout";
import leaveTrackerService from "../core/services/leaveTracker-service";


function RequestDetails() {
    const navigate = useNavigate();
    const id = decodeJwt().id;
    const jwtToken = localStorage.getItem('authToken');
    const { requestId } = useParams();
    const [request, setRequest] = useState({});

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
    }, [jwtToken]);

    const convertToDate = (timestamp) => {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const changeRequestStatus = async () => {
        try {
            await requestService.changeRequestStatus(request._id, { status: "Approved" }, jwtToken);
            const result = await leaveTrackerService.getParticularRecord({ userId: request.userId, leaveId: request.leaveId }, jwtToken);
            const leaveRecord = {
                userId: request.userId,
                balance: Math.abs(result.data[0].balance - request.totalDays),
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
            navigate('/request')
        } catch (error) {
            const toastOptions = configureToastOptions();
            toast.options = toastOptions;
            toast.error(error);
        }
    }

    return (<>
        <Layout></Layout>
        <div class="container py-5">
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <div class="card mb-4">
                        <div class="card-body">
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
                                    <p class="text-muted mb-0">{convertToDate(request.startDate)}-{convertToDate(request.endDate)}</p>
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
                                    <p className="form-label font-weight-bold">Leave Name:</p>
                                    <br />
                                </div>
                                <div className="col-sm-9">
                                    <p class="text-muted mb-0">{request.leaveName}</p>
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
                            <button style={{ margin: "10px" }} type="submit" class="btn btn-success" onClick={changeRequestStatus}>Approve</button>
                            <button class="btn btn-danger" onClick={declineRequest}>Decline</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}

export default RequestDetails;