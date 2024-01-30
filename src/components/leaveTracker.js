import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeLayout from "./employeeLayout";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LeaveTrackerService from '../core/services/leaveTracker-service';
import { configureToastOptions } from "../core/services/toast-service";
import decodeJwt from "../core/services/decodedJwtData-service";
import requestService from "../core/services/request-service";
import { NavbarBrand } from "react-bootstrap";

function LeaveTracker() {
  const navigate = useNavigate();
  const id = decodeJwt().id;
  const [compensantoryOff, setCompensantoryOff] = useState({});
  const [forgotIdCard, setForgotIdCard] = useState({});
  const [outOfOfficeOnDuty, setOutOfOfficeOnDuty] = useState({});
  const [paidLeave, setPaisLeave] = useState({});
  const [unpaidLeave, setUnpaidLeave] = useState({});
  const [workFromHome, setWorkFromHome] = useState({});
  const jwtToken = localStorage.getItem('authToken');
  const [request,setRequest]=useState([]);

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
        const requests=await requestService.getByUserId(id,jwtToken);
        setRequest(requests.data);
        console.log(request)
      } catch (error) {
        const toastOptions = configureToastOptions();
        toast.options = toastOptions;
        toast.error(error);
      }
    };
    fetchData();
  }, [jwtToken]);

  const convertToDate = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

  const navigateToApplyLeave = () => {
    navigate('/applyLeave');
  }

  const navigateToLeaveDetails=(requestId)=>{
    navigate(`/leaveDetail/${requestId}`);
  }

  return (
    <>
      <EmployeeLayout></EmployeeLayout>
      <button type="button" class="btn btn-success" style={{ marginTop: "20px", marginLeft: "1200px" }} onClick={navigateToApplyLeave}>Apply Leave</button>
      <div className="row">
        <div className="col-md-2 mb-2" style={{ marginTop: "40px" }}>
          <div className="card example-1 scrollbar-ripe-malinka" style={{ height: "300px" }}>
            <div className="card-body">
              <p id="section1" className="font-weight-bold"><strong>Compensantory Off</strong></p>
              <br />
              <p>Available:{compensantoryOff.balance}</p>
              <br />
              <p>Booked:{compensantoryOff.booked}</p>
            </div>
          </div>
        </div>
        <div className="col-md-2 mb-2" style={{ marginTop: "40px" }}>
          <div className="card example-1 scrollbar-ripe-malinka" style={{ height: "300px" }}>
            <div className="card-body">
              <p id="section1" className="font-weight-bold"><strong>Forgot Id-Card</strong></p>
              <br />
              <p>Available:{forgotIdCard.balance}</p>
              <br />
              <p>Booked:{forgotIdCard.booked}</p>
            </div>
          </div>
        </div>
        <div className="col-md-2 mb-2" style={{ marginTop: "40px" }}>
          <div className="card example-1 scrollbar-ripe-malinka" style={{ height: "300px" }}>
            <div className="card-body">
              <p id="section1" className="font-weight-bold"><strong>OutOf OfficeOnDuty</strong></p>
              <br />
              <p>Available:{outOfOfficeOnDuty.balance}</p>
              <br />
              <p>Booked:{outOfOfficeOnDuty.booked}</p>
            </div>
          </div>
        </div>
        <div className="col-md-2 mb-2" style={{ marginTop: "40px" }}>
          <div className="card example-1 scrollbar-ripe-malinka" style={{ height: "300px" }}>
            <div className="card-body">
              <p id="section1" className="font-weight-bold"><strong>Paid Leave</strong></p>
              <br />
              <p>Available:{paidLeave.balance}</p>
              <br />
              <p>Booked:{paidLeave.booked}</p>
            </div>
          </div>
        </div>
        <div className="col-md-2 mb-2" style={{ marginTop: "40px" }}>
          <div className="card example-1 scrollbar-ripe-malinka" style={{ height: "300px" }}>
            <div className="card-body">
              <p id="section1" className="font-weight-bold"><strong>Unpaid Leave</strong></p>
              <br />
              <p>Available:0</p>
              <br />
              <p>Booked:{unpaidLeave.booked}</p>
            </div>
          </div>
        </div>
        <div className="col-md-2 mb-2" style={{ marginTop: "40px" }}>
          <div className="card example-1 scrollbar-ripe-malinka" style={{ height: "300px" }}>
            <div className="card-body">
              <p id="section1" className="font-weight-bold"><strong>Work From Home</strong></p>
              <br />
              <p>Available:{workFromHome.balance}</p>
              <br />
              <p>Booked:{workFromHome.booked}</p>
            </div>
          </div>
        </div>
      </div>
      <br></br>
      <h4><strong>Leave History:</strong></h4>
      <table className="table table-hover" style={{ marginTop: "20px" }}>
                <thead>
                    <tr>
                        <th scope="col">Sr.No</th>
                        <th scope="col">From-To</th>
                        <th scope="col">Total Days</th>
                        <th scope="col">Leave Name</th>
                        <th scope="col">Reason</th>
                        <th scope="col">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {request.map((requestItem, index) => (
                    (
                            <tr key={requestItem._id} onClick={()=>navigateToLeaveDetails(requestItem._id)} className="table-row-hover">
                                <th scope="row">{index + 1}</th>
                                <td>{convertToDate(requestItem.startDate)}-{convertToDate(requestItem.endDate)}</td>
                                <td>{requestItem.totalDays}</td>
                                <td>{requestItem.leaveName}</td>
                                <td>.....</td>
                                <td>{requestItem.status}</td>
                            </tr>
                        )
                    ))}
                </tbody>
            </table>
    </>
  )
}

export default LeaveTracker;