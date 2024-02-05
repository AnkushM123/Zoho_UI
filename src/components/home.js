import Layout from "./layout"
import { useState, useEffect } from "react"
import homeService from '../core/services/home-service';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';
import { configureToastOptions } from "../core/services/toast-service";
import EmployeeLayout from "./employeeLayout";
import decodeJwt from "../core/services/decodedJwtData-service";
import AdminLayout from "./adminLayout";
import defaultUser from './user_3177440.png'

function Home() {
    const [employees, setEmployees] = useState([]);
    const jwtToken = localStorage.getItem('authToken');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await homeService(jwtToken);
                setEmployees(result.data);
            } catch (error) {
                const toastOptions = configureToastOptions();
                toast.options = toastOptions;
                toast.error(error);
            }

        };
        fetchData();

    }, [jwtToken]);

    const handleImageError = (event) => {
        event.target.src = defaultUser;
        event.target.onerror = null;
    };

    return (
        <>
            {decodeJwt().role === 'Employee' ? (
                <EmployeeLayout />
            ) : decodeJwt().role === 'Manager' ? (
                <Layout />
            ) : (
                <AdminLayout />
            )}
            <div className="col-md-11 mb-11" style={{ marginLeft: "40px", marginTop: "40px" }}>
                <div className="card example-1 scrollbar-ripe-malinka" style={{ height: "400px" }}>
                    <div className="card-body">
                        <h4>Team Overview:</h4>
                        <br />
                        {employees.map((employee, index) => (
                            <p key={index}>
                                <img
                                    src={process.env.REACT_APP_DOMAIN_URL + `/${employee.avatar}`}
                                    alt="Employee"
                                    height="30px"
                                    width="30px"
                                    style={{ borderRadius: "50%" }}
                                    onError={handleImageError}
                                />{' '}
                                {employee.employeeId}-<span className="font-weight-bold">{employee.name}</span>
                            </p>
                            
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home