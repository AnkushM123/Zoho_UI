import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './zoho-logo-web.png';
import { BiBell } from 'react-icons/bi';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from "react"
import decodeJwt from "../core/services/decodedJwtData-service";
import 'react-toastify/dist/ReactToastify.css';
import { configureToastOptions } from "../core/services/toast-service";
import { toast } from 'react-toastify';
import notificationService from "../core/services/notification-service";
import defaultUser from './user_3177440.png'

function Layout() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const id = decodeJwt().id;
  const [notification, setNotification] = useState([]);
  const [count, setCount] = useState(0)
  let increment = 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await notificationService.getNotification(id);
        const sortedData = result.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setNotification(sortedData);
        increment = 0;
        sortedData.forEach(request => {
          if (!request.isSeen) {
            increment++;
          }
        });
        setCount(increment);
      } catch (error) {
        const toastOptions = configureToastOptions();
        toast.options = toastOptions;
        toast.error(error);
      }
    };
    fetchData();
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const navigateToLogin = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  }

  const handleNotificationClick = async (notificationId, requestId, seenByManager) => {
    try {
      if (!seenByManager) {
        await notificationService.updateNotification(notificationId, { isSeen: true });
        navigate(`/requestDetail/${requestId}`);
      } else {
        navigate(`/notificationDetails/${requestId}`);
      }
      handleClose();
    } catch (error) {
      const toastOptions = configureToastOptions();
      toast.options = toastOptions;
      toast.error(error);
    }
  };

  const markAllRead = async () => {
    try {
      await notificationService.updateAllNotification(id, { isSeen: true });
      handleClose();
      window.location.reload()
    } catch (error) {
      const toastOptions = configureToastOptions();
      toast.options = toastOptions;
      toast.error(error);
    }
  };

  const handleImageError = (event) => {
    event.target.src = defaultUser;
    event.target.onerror = null;
  };

  function formatDate(date) {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    } else if (diffDays === 1) {
      return 'Yesterday ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    } else if (diffDays === -1) {
      return 'Tomorrow ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    } else {
      return date.toLocaleString('en-US', {
        day: 'numeric',
        month: 'long',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });
    }
  }

  return (
    <>
      <nav className="navbar navbar-expand-md navbar-dark bg-dark">
        <div className="container-fluid">
          <img src={logo} className="logoWidth" alt="logo" />
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item mx-1">
                <BiBell color="blue" className="bell" size={28} onClick={handleShow} />
                {count !== 0 && (
                  <span className="badge rounded-pill badge-notification bg-danger" style={{ pointerEvents: "none" }}>
                    {count}
                  </span>
                )}
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
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="modalTitle">Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modalBodyCss">
          {notification.length === 0 ? (
            <p className="text-center">No notifications available</p>
          ) : (
            notification.map((request, index) => (
              <div key={index} onClick={async () => await handleNotificationClick(request._id, request.leaveId, request.isSeen)}
                className={`notificationDivStyle notification-item cursorPointer px-2 ${request.isSeen ? '' : 'unseen'}`}>
                <img
                  className="image"
                  src={process.env.REACT_APP_DOMAIN_URL + `/${request.avatar}`}
                  alt="Employee"
                  height="30px"
                  width="30px"
                  onError={handleImageError}
                />
                <div>
                  <p className="notificationMsg">
                    {request.addedByEmployeeId}-{request.addedByName} {request.message}
                  </p>
                  <p className="notificationTime">
                    {formatDate(new Date(request.createdAt))}
                  </p>
                </div>
              </div>
            ))
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={async () => await markAllRead()} disabled={count === 0}>Mark all as read</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Layout;
