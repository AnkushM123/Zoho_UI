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
    const jwtToken = localStorage.getItem('authToken');
    const [request, setRequest] = useState([]);
    const [requestStatus, setRequestStatus] = useState(3);
    const [pageNumber, setPageNumber] = useState(0);
    const [leaveTypes, setLeaveTypes] = useState({});
    const perPage = 10;
    const perVisit = pageNumber * perPage;
    let pageCount = Math.ceil(request.length / perPage)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await requestService.getRequestByManagerId(id, jwtToken);
                setRequest(result.data);
            } catch (error) {
                const toastOptions = configureToastOptions();
                toast.options = toastOptions;
                toast.error(error);
            }
        }
        fetchData();
    }, [jwtToken]);

    const getLeaveTypeById = async (id) => {
        try {
          const result = await leaveTypeService(id, jwtToken);
          return result.data[0].leaveName;
        } catch (error) {
          const toastOptions = configureToastOptions();
          toast.options = toastOptions;
          toast.error(error);
        }
      };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const leaveTypePromises = request.map(requestItem => getLeaveTypeById(requestItem.leaveId));
                const leaveTypes = await Promise.all(leaveTypePromises);
                setLeaveTypes(leaveTypes);
            } catch (error) {
                const toastOptions = configureToastOptions();
          toast.options = toastOptions;
          toast.error(error);
            }
        };
        fetchData();
    }, [request, getLeaveTypeById]);

    const convertToDate = (timestamp) => {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${day}/${month}/${year}`;
    }

    const handleRequestTypeChange = (e) => {
        try {
            const selectedValue = e.target.value;
            setRequestStatus(selectedValue);
        } catch (error) {
            setRequest([]);
        }
    };

    useEffect(() => {
        async function fetchData() {
            try {
                setPageNumber(0);
                const result = requestStatus === 3 ?
                    await requestService.getRequestByManagerId(id, jwtToken) :
                    await requestService.getByManagerIdAndStatus(id, { status: requestStatus }, jwtToken);

                setRequest(result.data);

            } catch (error) {
                setRequest([]);
            }
        }
        fetchData();
    }, [requestStatus, id, jwtToken]);



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
                            onChange={(e) => handleRequestTypeChange(e)}
                        >
                            <option value={3}>All</option>
                            <option value={0}>Pending</option>
                            <option value={1}>Compensatory Off</option>
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
    <tr key={requestItem._id} onClick={() => requestStatus !== 'Pending' ? navigateToAllRequestDetails(requestItem._id) : navigateToRequest(requestItem._id)} className="table-row-hover">
        <th scope="row">{index + 1}</th>
        <td>{requestItem.employeeId}-{requestItem.name}</td>
        <td>{convertToDate(requestItem.startDate)} - {convertToDate(requestItem.endDate)}</td>
        <td>{requestItem.totalDays}</td>
        <td>{leaveTypes[index]}</td>
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