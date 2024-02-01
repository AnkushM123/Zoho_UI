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

function Request() {
    const navigate = useNavigate();
    const id = decodeJwt().id;
    const jwtToken = localStorage.getItem('authToken');
    const [request, setRequest] = useState([]);

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

    const convertToDate = (timestamp) => {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${day}/${month}/${year}`;
    }

    const navigateToRequest = (requestId) => {
        navigate(`/requestDetail/${requestId}`);
    }

    return (
        <>
         {decodeJwt().role === 'Employee' ? (
            <EmployeeLayout />
          ) : decodeJwt().role === 'Manager' ? (
            <Layout />
          ) :  (
            <AdminLayout />
          )}
            {request.length > 0 ? (
                <table className="table table-bordered table-hover" style={{ marginTop: "20px" }}>
                    <thead>
                        <tr>
                            <th scope="col">Sr.No</th>
                            <th scope="col">Employee Name</th>
                            <th scope="col">From-To</th>
                            <th scope="col">Total Days</th>
                            <th scope="col">Leave Type</th>
                            <th scope="col">Reason</th>
                        </tr>
                    </thead>
                    <tbody>
                        {request.map((requestItem, index) => (
                            requestItem.status === 'Pending' && (
                                <tr key={requestItem._id} onClick={() => navigateToRequest(requestItem._id)} className="table-row-hover">
                                    <th scope="row">{index + 1}</th>
                                    <td>{requestItem.employeeId}-{requestItem.name}</td>
                                    <td>{convertToDate(requestItem.startDate)} - {convertToDate(requestItem.endDate)}</td>
                                    <td>{requestItem.totalDays}</td>
                                    <td>{requestItem.leaveName}</td>
                                    <td>.....</td>
                                </tr>
                            )
                        ))}
                    </tbody>
                </table>
            ) : (
                <center>
                    <p>No pending requests available</p>
                </center>
            )}

        </>
    );
}

export default Request;