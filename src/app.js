import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import Login from "./components/login";
import { ToastContainer } from "react-toastify";
import VarifyEmail from "./components/varifyEmail";
import SetPassword from "./components/setPassword";
import Home from "./components/home";
import Profile from "./components/profile";
import Edit from "./components/edit";
import Layout from "./components/layout";
import Register from "./components/register";
import LeaveTracker from "./components/leaveTracker";
import ApplyLeave from "./components/applyLeave";
import Request from "./components/request";
import RequestDetails from "./components/requestDetails";
import LeaveDetails from "./components/leaveDetails";
import ProtectedRoute from "./components/protectedRoute";
import AddLeave from "./components/addLeave";
import ChangePassword from "./components/changePassword";
import AllRequestDetails from "./components/allRequestDetails";
import NotificationDetails from "./components/notificationDetails";

function App() {
    return (
        <>
            <ToastContainer></ToastContainer>
            <Router>
                <Routes>
                    <Route
                        index
                        element={<Login />}
                    />
                    <Route
                        exact
                        path="/login"
                        element={<Login />}
                    />
                    <Route
                        path="/varifyEmail"
                        element={<VarifyEmail />}
                    />
                    <Route
                        path="/setPassword"
                        element={<SetPassword />}
                    />
                    <Route element={<Layout/>}>
                    <Route
                        index
                        path="/home"
                        element={<ProtectedRoute Component={Home} />}
                    />
                    <Route
                        path="/profile"
                        element={<ProtectedRoute Component={Profile} />}
                    />
                    <Route
                        path="/edit"
                        element={<ProtectedRoute Component={Edit} />}
                    />
                    <Route
                        path="/register"
                        element={<ProtectedRoute Component={Register} />}
                    />
                    <Route
                        path="/leaveTracker"
                        element={<ProtectedRoute Component={LeaveTracker} />}
                    />
                    <Route
                        path="/applyLeave"
                        element={<ProtectedRoute Component={ApplyLeave} />}
                    />
                    <Route
                        path="/request"
                        element={<ProtectedRoute Component={Request} />}
                    />
                    <Route
                        path="/requestDetail/:requestId"
                        element={<ProtectedRoute Component={RequestDetails} />}
                    />
                    <Route
                        path="/leaveDetail/:requestId"
                        element={<ProtectedRoute Component={LeaveDetails} />}
                    />
                    <Route
                        path="/addLeave"
                        element={<ProtectedRoute Component={AddLeave} />}
                    />
                    <Route
                        path="/changePassword"
                        element={<ProtectedRoute Component={ChangePassword} />}
                    />
                    <Route
                        path="/allRequestDetails/:requestId"
                        element={<ProtectedRoute Component={AllRequestDetails} />}
                    />
                    <Route
                        path="/notificationDetails/:requestId"
                        element={<ProtectedRoute Component={NotificationDetails} />}
                    />
                    </Route>
                </Routes>
            </Router>
        </>
    );
}

export default App;