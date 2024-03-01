import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeLayout from "./employeeLayout";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LeaveTrackerService from '../core/services/leaveTracker-service';
import { configureToastOptions } from "../core/services/toast-service";
import decodeJwt from "../core/services/decodedJwtData-service";
import requestService from "../core/services/request-service";
import { BiCalendarCheck } from 'react-icons/bi';
import Layout from "./layout";
import AdminLayout from "./adminLayout";
import leaveTypeService from '../core/services/leaveType-service';

function LeaveTracker() {
  const navigate = useNavigate();
  const id = decodeJwt().id;
  const [compensantoryOff, setCompensantoryOff] = useState({});
  const [forgotIdCard, setForgotIdCard] = useState({});
  const [outOfOfficeOnDuty, setOutOfOfficeOnDuty] = useState({});
  const [paidLeave, setPaisLeave] = useState({});
  const [unpaidLeave, setUnpaidLeave] = useState({});
  const [workFromHome, setWorkFromHome] = useState({});
  const [request, setRequest] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState({});
  const jwtToken = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await LeaveTrackerService.getLeaveRecords({ userId: id }, jwtToken);
        result.data.forEach((leave) => {
          switch (leave.leaveId) {
            case '659bc36c01e2f1640c26260e':
              setCompensantoryOff(leave);
              break;
            case '659bc3ae01e2f1640c262612':
              setForgotIdCard(leave);
              break;
            case '659bc3b501e2f1640c262614':
              setOutOfOfficeOnDuty(leave);
              break;
            case '659bc3c101e2f1640c262616':
              setPaisLeave(leave);
              break;
            case '659bc3c601e2f1640c262618':
              setUnpaidLeave(leave);
              break;
            case '659bc3ce01e2f1640c26261a':
              setWorkFromHome(leave);
              break;
            default:
              break;
          }

        });
        const requests = await requestService.getByUserId(id, jwtToken);
        const sortedData = requests.data.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
        setRequest(sortedData);
        const leaveTypesData = {};
        for (const requestItem of requests.data) {
          const leaveType = await getLeaveTypeById(requestItem.leaveId, jwtToken);
          leaveTypesData[requestItem.leaveId] = leaveType;
        }
        setLeaveTypes(leaveTypesData);
      } catch (error) {
        const toastOptions = configureToastOptions();
        toast.options = toastOptions;
        toast.error(error);
      }
    };
    fetchData();
  }, [id]);

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

  const navigateToApplyLeave = () => {
    navigate('/applyLeave');
  }

  const navigateToLeaveDetails = (requestId) => {
    navigate(`/leaveDetail/${requestId}`);
  }

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

  return (
    <>
      {decodeJwt().role === 'Employee' ? (
        <EmployeeLayout />
      ) : decodeJwt().role === 'Manager' ? (
        <Layout />
      ) : (
        <AdminLayout />
      )}
      <div class="container-fluid py-1">
        <div class="row">
          <div class="col-12">
            <button type="button" class="btn btn-success float-right my-3" onClick={navigateToApplyLeave}>Apply Leave</button>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-2 col-md-4 col-12 mb-2">
            <div className="card">
              <div className="card-body">
                <div id="section1" className="font-weight-bold"><strong>Compensantory Off</strong></div>
                <center>
                  <BiCalendarCheck size={50} className="iconmargin" />
                  <p>Available  : {compensantoryOff.balance}</p>
                  <p>Booked   : {compensantoryOff.booked}</p>
                </center>
              </div>
            </div>
          </div>
          <div className="col-lg-2 col-md-4 col-12 mb-2">
            <div className="card">
              <div className="card-body">
                <div id="section1" className="font-weight-bold"><strong>Forgot Id-Card</strong></div>
                <center>
                  <BiCalendarCheck size={50} className="iconmargin" />
                  <p>Available  : {forgotIdCard.balance}</p>
                  <p>Booked  : 0</p>
                </center>
              </div>
            </div>
          </div>
          <div className="col-lg-2 col-md-4 col-12 mb-2">
            <div className="card ">
              <div className="card-body">
                <div id="section1" className="font-weight-bold"><strong>Out Of Office On-Duty</strong></div>
                <center>
                  <BiCalendarCheck size={50} className="iconmargin" />
                  <p>Available  : {outOfOfficeOnDuty.balance}</p>
                  <p>Booked  : 0</p>
                </center>
              </div>
            </div>
          </div>
          <div className="col-lg-2 col-md-4 col-sm-12 mb-2">
            <div className="card ">
              <div className="card-body">
                <div id="section1" className="font-weight-bold"><strong>Paid Leave</strong></div>
                <center>
                  <BiCalendarCheck size={50} className="iconmargin" />
                  <p>Available  : {paidLeave.balance}</p>
                  <p>Booked  : {paidLeave.booked}</p>
                </center>
              </div>
            </div>
          </div>
          <div className="col-lg-2 col-md-4 col-sm-12 mb-2">
            <div className="card ">
              <div className="card-body">
                <div id="section1" className="font-weight-bold"><strong>Unpaid Leave</strong></div>
                <center>
                  <BiCalendarCheck size={50} className="iconmargin" />
                  <p>Available  : 0</p>
                  <p>Booked  : {unpaidLeave.booked}</p>
                </center>
              </div>
            </div>
          </div>
          <div className="col-lg-2 col-md-4 col-sm-12 mb-2">
            <div className="card">
              <div className="card-body">
                <div id="section1" className="font-weight-bold"><strong>Work From Home</strong></div>
                <center>
                  <BiCalendarCheck size={50} className="iconmargin" />
                  <p>Available  : {workFromHome.balance}</p>
                  <p>Booked  : {workFromHome.booked}</p>
                </center>
              </div>
            </div>
          </div>
        </div>
        <br></br><br></br>
        <h4><strong> Leave History:</strong></h4>
        <div class="col-md-12 mb-12 divStyle">
          <div class="card example-1 scrollbar-ripe-malinka" style={{ height: "400px" }}>
            {request.length > 0 ? (
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th scope="col">Sr.No</th>
                    <th scope="col">From-To</th>
                    <th scope="col">Total Days</th>
                    <th scope="col">Leave Type</th>
                    <th scope="col">Reason</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {request.map((requestItem, index) => (
                    <tr key={requestItem._id} onClick={() => navigateToLeaveDetails(requestItem._id)} className="table-row-hover">
                      <th scope="row">{index + 1}</th>
                      <td>{convertToDate(requestItem.startDate)} - {convertToDate(requestItem.endDate)}</td>
                      <td>{requestItem.totalDays}</td>
                      <td>
                        {leaveTypes[requestItem.leaveId] || "Loading..."}
                      </td>
                      <td>
                        {requestItem.reasonForLeave !== 'undefined'
                          ? (requestItem.reasonForLeave.length <= 5
                            ? requestItem.reasonForLeave
                            : `${requestItem.reasonForLeave.substring(0, 5)}...`)
                          : '-'}
                      </td>
                      {requestItem.status !== undefined ?
                        <td>{getStatus(requestItem.status)}</td> : <td>-</td>
                      }
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <center>
                <p>No leaves record</p>
              </center>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default LeaveTracker;