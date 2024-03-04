import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LeaveTrackerService from '../core/services/leaveTracker-service';
import { configureToastOptions } from "../core/services/toast-service";
import decodeJwt from "../core/services/decodedJwtData-service";
import EmployeeLayout from "./employeeLayout";
import Layout from "./layout";

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
      {localStorage.getItem('role') === 'Employee' ? (
        <EmployeeLayout />
      ) : (
        <Layout />
      )
      }
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
                  <p>Available  : {workFromHome.balance}</p>
                  <p>Booked  : {workFromHome.booked}</p>
                </center>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LeaveTracker;