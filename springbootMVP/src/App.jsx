import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Employee from './Employee.jsx';

function App() {

    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            const response = await axios.get('http://localhost:8080/employees');
            console.log('res', response);
            setEmployees(response.data);
        };
        fetchEmployees();

    }, []);

    return (
        <div>
            <Employee setEmployees = {setEmployees} employees={employees} />  {/* Correct prop name */}
        </div>
    );
}

export default App;
