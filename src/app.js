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
import Register from "./components/register";
import LeaveTracker from "./components/leaveTracker";
import ApplyLeave from "./components/applyLeave";
import Request from "./components/request";
import RequestDetails from "./components/requestDetails";
import LeaveDetails from "./components/leaveDetails";

function App() {
    return (
        <>
            <ToastContainer></ToastContainer>
            <Router>
                <Routes>
                    <Route
                        exact
                        path="/"
                        element={<Login />}
                    />
                </Routes>
                <Routes>
                    <Route
                        exact
                        path="/varifyEmail"
                        element={<VarifyEmail />}
                    />
                    <Route
                        exact
                        path="/setPassword"
                        element={<SetPassword />}
                    />
                    <Route
                        exact
                        path="/home"
                        element={<Home />}
                    />
                    <Route
                        exact
                        path="/profile"
                        element={<Profile />}
                    />
                    <Route
                        exact
                        path="/edit"
                        element={<Edit />}
                    />
                    <Route
                        exact
                        path="/register"
                        element={<Register />}
                    />
                    <Route
                        exact
                        path="/leaveTracker"
                        element={<LeaveTracker />}
                    />
                    <Route
                        exact
                        path="/applyLeave"
                        element={<ApplyLeave />}
                    />
                    <Route
                        exact
                        path="/request"
                        element={<Request />}
                    />
                    <Route
                        exact
                        path="/requestDetail/:requestId"
                        element={<RequestDetails />}
                    />
                                        <Route
                        exact
                        path="/leaveDetail/:requestId"
                        element={<LeaveDetails />}
                    />
                </Routes>
            </Router>
        </>
    );
}

export default App;