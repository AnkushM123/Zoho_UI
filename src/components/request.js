import Layout from "./layout";
import requestService from "../core/services/request-service";
import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { configureToastOptions } from "../core/services/toast-service";
import decodeJwt from "../core/services/decodedJwtData-service";
import { useNavigate } from "react-router-dom";
import '../App.css';
import EmployeeLayout from "./employeeLayout";
import AdminLayout from "./adminLayout";
import ReactPaginate from "react-paginate";
import leaveTypeService from '../core/services/leaveType-service';

function Request() {
    const navigate = useNavigate();
    const id = decodeJwt().id;
    const [request, setRequest] = useState([]);
    const [requestStatus, setRequestStatus] = useState(4);
    const [pageNumber, setPageNumber] = useState(0);
    const [leaveTypes, setLeaveTypes] = useState({});
    const perPage = 10;
    const perVisit = pageNumber * perPage;
    let pageCount = Math.ceil(request.length / perPage);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await requestService.getRequestByManagerId(id);
                const sortedData = result.data.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
                setRequest(sortedData);
            } catch (error) {
                const toastOptions = configureToastOptions();
                toast.options = toastOptions;
                toast.error(error);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        const fetchLeaveTypes = async () => {
            try {
                const leaveTypePromises = request.map(async (requestItem) => {
                    const result = await leaveTypeService(requestItem.leaveId);
                    return result.data[0].leaveName;
                });
                const leaveTypeNames = await Promise.all(leaveTypePromises);
                const leaveTypeMap = request.reduce((acc, curr, index) => {
                    acc[curr._id] = leaveTypeNames[index];
                    return acc;
                }, {});
                setLeaveTypes(leaveTypeMap);
            } catch (error) {
                const toastOptions = configureToastOptions();
                toast.options = toastOptions;
                toast.error(error);
            }
        };
        fetchLeaveTypes();
    }, [request]);

    const convertToDate = (timestamp) => {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${day}/${month}/${year}`;
    }

    const handleRequestTypeChange = (e) => {
        try {
            const selectedValue = parseInt(e.target.value);
            setRequestStatus(selectedValue);
        } catch (error) {
            setRequestStatus(4);
        }
    };

    useEffect(() => {
        async function fetchData() {
            try {
                setPageNumber(0);
                const result = requestStatus === 4 ?
                    await requestService.getRequestByManagerId(id) :
                    await requestService.getByManagerIdAndStatus(id, { status: requestStatus });

                const sortedData = result.data.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
                setRequest(sortedData);

            } catch (error) {
                setRequest([]);
            }
        }
        fetchData();
    }, [requestStatus]);

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

    const navigateToRequest = (requestId) => {
        navigate(`/requestDetail/${requestId}`);
    }

    const navigateToAllRequestDetails = (requestId) => {
        navigate(`/allRequestDetails/${requestId}`);
    }

    const pageChange = ({ selected }) => {
        setPageNumber(selected)
    }

    return (
        <>
            {decodeJwt().role === 'Employee' ? (
                <EmployeeLayout />
            ) : decodeJwt().role === 'Manager' ? (
                <Layout />
            ) : (
                <AdminLayout />
            )}
            <div className="container">
                <div className="row">
                    <div className="col-md-2 offset-md-10 py-3">
                        <select
                            className="form-select"
                            id="requestStatus"
                            name="requestStatus"
                            required
                            value={requestStatus}
                            onChange={(e) => handleRequestTypeChange(e)}>
                            <option value={4}>All</option>
                            <option value={0}>Pending</option>
                            <option value={3}>Compensatory Off</option>
                        </select>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card requestCard">
                            {request.length > 0 ? (
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col">Sr.No</th>
                                            <th scope="col">Employee Name</th>
                                            <th scope="col">From-To</th>
                                            <th scope="col">Total Days</th>
                                            <th scope="col">Leave Type</th>
                                            <th scope="col">Reason</th>
                                            <th scope="col">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {request.slice(perVisit, perVisit + perPage).map((requestItem, index) => (
                                            <tr key={requestItem._id} onClick={() => requestStatus !== 0 ? navigateToAllRequestDetails(requestItem._id) : navigateToRequest(requestItem._id)} className="table-row-hover">
                                                <th scope="row">{index + 1}</th>
                                                <td>{requestItem.employeeId}-{requestItem.name}</td>
                                                <td>{convertToDate(requestItem.startDate)} - {convertToDate(requestItem.endDate)}</td>
                                                <td>{requestItem.totalDays}</td>
                                                <td>{leaveTypes[requestItem._id]}</td>
                                                {requestItem.reasonForLeave !== 'undefined' ?
                                                    <td>
                                                        {requestItem.reasonForLeave.length <= 5
                                                            ? requestItem.reasonForLeave
                                                            : `${requestItem.reasonForLeave.substring(0, 4)}...`}
                                                    </td> : <td>-</td>
                                                }
                                                {requestItem.status !== 'undefined' ?
                                                    <td>{getStatus(requestItem.status)}</td> : <td>-</td>
                                                }
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <center>
                                    <p>No requests available</p>
                                </center>
                            )}
                        </div>
                    </div>
                    <div className="col-md-12 my-1 justify-content-center d-flex">
                        <ReactPaginate
                            previousLabel={'Prev'}
                            nextLabel={'Next'}
                            pageCount={pageCount}
                            onPageChange={pageChange}
                            containerClassName={'pagination'}
                            pageClassName={'page-item'}
                            pageLinkClassName={'page-link'}
                            previousClassName={'page-item'}
                            previousLinkClassName={'page-link'}
                            nextClassName={'page-item'}
                            nextLinkClassName={'page-link'}
                            forcePage={pageNumber}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Request;
