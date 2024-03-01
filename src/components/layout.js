import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './zoho-logo-web.png';

function Layout() {
  const navigate = useNavigate();

  const navigateToLogin = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  }

  return (
    <>
      <nav className="navbar navbar-expand-md navbar-dark bg-dark">
        <div className="container-fluid">
          <img src={logo}
            className="logoWidth" alt="logo" />
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" >
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link font-weight-bold" to="/home">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link font-weight-bold" to="/profile">Profile</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link font-weight-bold" to="/request">Leave Request</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link font-weight-bold" to="/leaveTracker">Leave Tracker</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link font-weight-bold" to="/addLeave">Add Leave</Link>
              </li>
            </ul>
          </div>
          <button className="btn btn-danger" onClick={navigateToLogin}>Log Out</button>
        </div>
      </nav>
    </>
  )
}

export default Layout;