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
                </Routes>
            </Router>
        </>
    );
}

export default App;