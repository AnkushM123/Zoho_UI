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
import ProtectedRoute from "./components/protectedRoute";

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
                    <Route

                        path="/varifyEmail"
                        element={<VarifyEmail />}
                    />
                    <Route

                        path="/setPassword"
                        element={<SetPassword />}
                    />
                    <Route

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
                </Routes>
            </Router>
        </>
    );
}

export default App;