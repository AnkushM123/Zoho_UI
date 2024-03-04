import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { configureToastOptions } from "../core/services/toast-service";
import requestService from "../core/services/request-service";
import decodeJwt from "../core/services/decodedJwtData-service";
import { useParams } from 'react-router-dom';
import Layout from "./layout";
import AdminLayout from "./adminLayout";
import EmployeeLayout from "./employeeLayout";
import leaveTypeService from '../core/services/leaveType-service';
import profileService from "../core/services/profile-service";

function NotificationDetails() {
    const navigate = useNavigate();
    const { requestId } = useParams();
    const [request, setRequest] = useState({});
    const [leaveType, setLeaveType] = useState('');
    const [managerDetail, setManagerDetail] = useState({ managerName: '', managerEmployeeId: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await requestService.getByRequestId(requestId);
                setRequest(result.data[0]);
                const managerInfo = await profileService.getManagerDetail(result.data[0].managerId);
                setManagerDetail({ managerName: managerInfo.data[0].name, managerEmployeeId: managerInfo.data[0].employeeId })
                const leaveTypeResult = await leaveTypeService(result.data[0].leaveId);
                setLeaveType(leaveTypeResult.data[0].leaveName);
            } catch (error) {
                const toastOptions = configureToastOptions();
                toast.options = toastOptions;
                toast.error(error);
            }
        }
        fetchData();
    }, [requestId]);

    const convertToDate = (timestamp) => {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${day}/${month}/${year}`;
    }

    const getStatus = (status) => {
        switch (status) {
            case 0:
                return 'Pending';
            case 1:
                return 'Approved';
            case 2:
                return 'Rejected';
            case 3:
                return 'Added';
            default:
                return '';
        }
    };

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
                            {decodeJwt().role !== 'Employee' ?
                                <div className="row">
                                    <div className="col-sm-3">
                                        <p className="form-label font-weight-bold">Employee Name:</p>
                                        <br />
                                    </div>
                                    <div className="col-sm-9">
                                        <p class="text-muted mb-0">{request.employeeId}-{request.name}</p>
                                    </div>
                                </div> : <div className="row">
                                    <div className="col-sm-3">
                                        <p className="form-label font-weight-bold">Manager Name:</p>
                                        <br />
                                    </div>
                                    <div className="col-sm-9">
                                        <p class="text-muted mb-0">{managerDetail.managerEmployeeId}-{managerDetail.managerName}</p>
                                    </div>
                                </div>
                            }
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
                                    <p class="text-muted mb-0">{leaveType}</p>
                                </div>
                            </div>
                            {request.reasonForLeave !== 'undefined' && (
                                <div class="row">
                                    <div class="col-sm-3">
                                        <p class="form-label font-weight-bold">Reason For Leave:</p>
                                        <br></br>
                                    </div>
                                    <div class="col-sm-9">
                                        <p class="text-muted mb-0">{request.reasonForLeave}</p>
                                    </div>
                                </div>
                            )}
                            {request.status !== 'undefined' && (
                                <div class="row">
                                    <div class="col-sm-3">
                                        <p class="form-label font-weight-bold">Status:</p>
                                        <br></br>
                                    </div>
                                    <div class="col-sm-9">
                                        <p class="text-muted mb-0">{getStatus(request.status)}</p>
                                    </div>
                                </div>
                            )}
                            {request.comment !== 'undefined' && (
                                <div className="row">
                                    <div className="col-sm-3">
                                        <p className="form-label font-weight-bold">Comment:</p>
                                        <br />
                                    </div>
                                    <div className="col-sm-9">
                                        <p className="text-muted mb-0">{request.comment}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}

export default NotificationDetails;