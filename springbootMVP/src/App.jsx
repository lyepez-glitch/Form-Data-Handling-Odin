import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Employee from './Employee.jsx';
import Role from './Role';


function App() {

    const [employees, setEmployees] = useState([]);
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            const response = await axios.get('http://localhost:8080/employees');
            console.log('res', response);
            setEmployees(response.data);
            const role_response = await axios.get('http://localhost:8080/roles');
            console.log('res', role_response);
            setEmployees(response.data);
            setRoles(role_response.data);
        };
        fetchEmployees();

    }, []);

    return (
        <div>
            <Employee setEmployees = {setEmployees} employees={employees} />  <Role setRoles={setRoles} roles={roles}/>

        </div>
    );
}

export default App;
