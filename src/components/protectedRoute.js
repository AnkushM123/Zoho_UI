import { Navigate } from "react-router-dom";

function ProtectedRoute(props) {
    const { Component } = props;

    const isAuthenticated = localStorage.getItem('authToken');

    return isAuthenticated ? (
        <Component />
    ) : (
        <Navigate to="/" replace state={{ from: window.location.pathname }} />
    );
}

export default ProtectedRoute;
