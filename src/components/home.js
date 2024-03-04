import Layout from "./layout"
import { useState, useEffect } from "react"
import homeService from '../core/services/home-service';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';
import { configureToastOptions } from "../core/services/toast-service";
import EmployeeLayout from "./employeeLayout";

function Home() {
    const [employees, setEmployees] = useState([]);
    const jwtToken = localStorage.getItem('authToken');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await homeService(jwtToken);
                if (result.data && result.data.length > 0) {
                    setEmployees(result.data);
                }
                else {
                    setEmployees([]);
                }
            } catch (error) {
                const toastOptions = configureToastOptions();
                toast.options = toastOptions;
                toast.error(error);
            }
        };
        fetchData();
    }, [jwtToken]);

    return (<>
        {localStorage.getItem('role') === 'Employee' ? (
            <EmployeeLayout />
        ) : (
            <Layout />
        )
        }
        <div class="col-md-11 mb-11 homeCss">
            <div class="card example-1 scrollbar-ripe-malinka">
                <div class="card-body">
                    <h4><strong>Employee:</strong></h4>
                    <br></br>
                    {
                        employees.map((employee, index) =>
                            <p>{index + 1}. <img className="employeesImage" src={process.env.REACT_APP_DOMAIN_URL + `/${employee.avatar}`} alt="Employee" height="30px" width="30px" /> {employee.name}</p>
                        )
                    }
                </div>
            </div>
        </div>
    </>
    )
}

export default Home