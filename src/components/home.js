import { useState, useEffect } from "react"
import homeService from '../core/services/home-service';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';
import { configureToastOptions } from "../core/services/toast-service";
import defaultUser from './user_3177440.png'

function Home() {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await homeService();
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

    }, []);

    const handleImageError = (event) => {
        event.target.src = defaultUser;
        event.target.onerror = null;
    };

    return (<>
        <div class="col-md-11 mt-4 homeCss">
            <div class="card example-1 scrollbar-ripe-malinka">
                <div class="card-body">
                    <h4 className="mb-3"><strong>Employee:</strong></h4>
                    {
                        employees.map((employee, index) =>
                            <p>{index + 1}. <img
                                className="image"
                                src={process.env.REACT_APP_DOMAIN_URL + `/${employee.avatar}`}
                                alt="Employee"
                                height="30px"
                                width="30px"
                                onError={handleImageError}
                            /> {employee.name}</p>
                        )
                    }
                </div>
            </div>
        </div>
    </>
    )
}

export default Home