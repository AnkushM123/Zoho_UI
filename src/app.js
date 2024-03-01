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
                </Routes>
            </Router>
        </>
    );
}

export default App;