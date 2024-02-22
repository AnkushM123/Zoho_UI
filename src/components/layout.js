import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './zoho-logo-web.png';
import { BiBell } from 'react-icons/bi';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';

function Layout() {
  const navigate = useNavigate();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item mx-1">
                  <BiBell color="blue" className="bell" size={28} onClick={handleShow} />
                <span class="badge rounded-pill badge-notification bg-danger" style={{ pointerEvents: "none" }}>1</span>
              </li>
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
      <Modal show={show} onHide={handleClose} dialogClassName="modal-90w">
        <Modal.Header closeButton>
          <Modal.Title>Request</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '200px', overflowY: 'auto' }}>
          <table class="table table-hover" style={{ borderCollapse: 'separate', borderSpacing: '0' }}>
            <tbody>
              <tr>
                <p>ankush sent request for 2 days</p>
              </tr>
              <tr>
                <p>ankush sent request for 2 days</p>
              </tr>
              <tr>
                <p>ankush sent request for 2 days</p>
              </tr>
              <tr>
                <p>ankush sent request for 2 days</p>
              </tr>
              <tr>
                <p>ankush sent request for 2 days</p>
              </tr>
              <tr>
                <p>ankush sent request for 2 days</p>
              </tr>
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Layout;
