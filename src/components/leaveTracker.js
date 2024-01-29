import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeLayout from "./employeeLayout";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LeaveTrackerService from '../core/services/leaveTracker-service';
import { configureToastOptions } from "../core/services/toast-service";
import decodeJwt from "../core/services/decodedJwtData-service";

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
      } catch (error) {
        const toastOptions = configureToastOptions();
        toast.options = toastOptions;
        toast.error(error);
      }
    };
    fetchData();
  }, [jwtToken]);

  const navigateToApplyLeave = () => {
    navigate('/applyLeave');
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
              <p>Booked:0</p>
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
              <p>Booked:0</p>
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
              <p>Booked:0</p>
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
              <p>Booked:0</p>
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
              <p>Booked:{unpaidLeave.balance}</p>
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
              <p>Booked:0</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LeaveTracker;