import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Employee from './Employee.jsx';
import Role from './Role';
import Audit from  './Audit';
import Department from './Department';

function App() {

    const [employees, setEmployees] = useState([]);
    const [roles, setRoles] = useState([]);
    const [audits,setAudits] = useState([]);
    const [departments,setDepartments] = useState([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            const response = await axios.get('http://localhost:8080/employees');
            console.log('res', response);
            setEmployees(response.data);
            const role_response = await axios.get('http://localhost:8080/roles');
            console.log('res', role_response);
            setEmployees(response.data);
            setRoles(role_response.data);
            const auditResponse = await axios.get('http://localhost:8080/employeeAudits');
            console.log('audit res', auditResponse);
            setAudits(auditResponse.date);
        };
        fetchEmployees();

    }, []);

    return (
        <div>
            <Employee setAudits={setAudits} setEmployees = {setEmployees} employees={employees} />  <Role setRoles={setRoles} roles={roles}/>
            <Audit setAudits={setAudits} audits={audits}/>
            <Department setDepartments={setDepartments} departments={departments}/>

        </div>
    );
}

export default App;
