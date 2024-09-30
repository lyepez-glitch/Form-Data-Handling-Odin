import { useState } from 'react';
import axios from 'axios';

function Employee({ employees,setEmployees,setAudits }) {
    const [employeeName, setEmployeeName] = useState('');
    const [departmentId, setDepartmentId] = useState('');
    const [roleId, setRoleId] = useState('');
    const [salary, setSalary] = useState('');
    const[edit,setEdit] = useState(null);
    const [editedEmployeeName,setEditedEmployeeName] = useState('');
    const [editedDepartmentId,setEditedDepartmentId] = useState('');
    const [editedRoleId,setEditedRoleId] = useState('');
    const [editedSalary,setEditedSalary] = useState('');
  const handleDeleteClick = async(id) =>{
    const response = await axios.delete(`http://localhost:8080/employees/delete/${id}`);
    console.log('delete res:', response.data);
    const fetchEmps = await axios.get('http://localhost:8080/employees');
    setEmployees(fetchEmps.data);
  }

  const handleEditClick = (emp) => {
      setEdit(emp.id);
      console.log('edited emp',emp)
      setEditedEmployeeName(emp.employeeName);
      setEditedDepartmentId(emp.departmentId);
      setEditedRoleId(emp.roleId);
      setEditedSalary(emp.salary);
  };

  const handleEditSubmit = async(event,id)=>{
    event.preventDefault();
    console.log('editedEmployeeName ',editedEmployeeName)
    const employeeDTO = {
      employeeName:editedEmployeeName,
      departmentId: Number(editedDepartmentId),
      roleId: Number(editedRoleId),
      salary: Number(editedSalary)
    }
    console.log('Edited Employee DTO:', employeeDTO);
    const response = await axios.put(`http://localhost:8080/employees/update/${id}`,employeeDTO);
    console.log('update res:', response.data);


    setEditedEmployeeName('');
    setEditedDepartmentId('');
    setEditedRoleId('');
    setEditedSalary('');
    const fetchEmps = await axios.get('http://localhost:8080/employees');
    const fetchAudits = await axios.get('http://localhost:8080/employeeAudits');
    console.log('fetchAudits ',fetchAudits.data,fetchAudits);
    setAudits(fetchAudits.data);
    setEdit(null);
    setEmployees(fetchEmps.data);
  }

  const handleSubmit = async (event) =>{
    event.preventDefault();
    const employeeDTO = {
      employeeName,
      departmentId: Number(departmentId),
      roleId: Number(roleId),
      salary: Number(salary)
    }
    console.log('Employee DTO:', employeeDTO);
    const response = await axios.post('http://localhost:8080/employees/add',employeeDTO);
    console.log('post res:', response.data);
    setEmployeeName('');
    setDepartmentId('');
    setRoleId('');
    setSalary('');
    const fetchEmps = await axios.get('http://localhost:8080/employees');
    setEmployees(fetchEmps.data);


  }
  return (
    <div>
      <div>
          {employees.map((emp, index) => (
            edit === emp.id?(
              <form key={emp.id} onSubmit = {(e)=>handleEditSubmit(e,emp.id)}>

                <label>
                    Edit Employee Name:
                    <input type="text" value={editedEmployeeName}
                        onChange={(e) => setEditedEmployeeName(e.target.value)}/>
                </label>


                <label>
                    Edit Department ID:
                    <input type="number" value={editedDepartmentId}
                        onChange={(e) => setEditedDepartmentId(e.target.value)}/>
                </label>


                <label>
                    Edit Role ID:
                    <input type="number" value={editedRoleId} onChange={(e) => setEditedRoleId(e.target.value)}/>
                </label>


                <label>
                    Edit Salary:
                    <input type="number" value={editedSalary} onChange={(e) => setEditedSalary(e.target.value)}/>
                </label>

            <button type="submit">Submit Changes</button>


        </form>
            ):(
              <div key={emp.id}>
                  <p>Employee Name: {emp.employeeName}</p>
                  <p>Salary: {emp.salary}</p>
                  <button onClick={()=>handleEditClick(emp)}>Edit</button>
                  <button onClick={()=>handleDeleteClick(emp.id)}>Delete</button>
              </div>

            )

          ))}
      </div>
      <form onSubmit = {handleSubmit}>

                <label>
                    Employee Name:
                    <input type="text" value={employeeName}
                        onChange={(e) => setEmployeeName(e.target.value)}/>
                </label>


                <label>
                    Department ID:
                    <input type="number" value={departmentId}
                        onChange={(e) => setDepartmentId(e.target.value)}/>
                </label>


                <label>
                    Role ID:
                    <input type="number" value={roleId} onChange={(e) => setRoleId(e.target.value)}/>
                </label>


                <label>
                    Salary:
                    <input type="number" value={salary} onChange={(e) => setSalary(e.target.value)}/>
                </label>

            <button type="submit">Add Employee</button>


        </form>
    </div>



  );
}

export default Employee;
