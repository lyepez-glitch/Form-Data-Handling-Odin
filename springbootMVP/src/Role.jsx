import { useState } from 'react';
import axios from 'axios';

function Role({setRoles,roles}){
  const [roleName, setRoleName] = useState('');
    const [roleId, setRoleId] = useState('');
    const [salary, setSalary] = useState('');
    const[edit,setEdit] = useState(null);
    const [editedRoleName,setEditedRoleName] = useState('');
    const [editedRoleId,setEditedRoleId] = useState('');
    const [editedSalary,setEditedSalary] = useState('');

  const handleDeleteRoleClick = async (id) => {
    const response = await axios.delete(`http://localhost:8081/roles/delete/${id}`);
    console.log('role delete res:', response.data);
    const fetchRoles = await axios.get('http://localhost:8081/roles');
    setRoles(fetchRoles.data);
  }

  const handleEditRoleClick = async (role) => {
    setEdit(role.id);

    setEditedRoleName(role.roleName);
    setEditedSalary(role.salary);
  }
  const handleEditRoleSubmit = async(event,id,role)=>{
    event.preventDefault();
    const roleDTO = {
      roleName:editedRoleName,
      salary: Number(editedSalary)
    }
    console.log('Edited Role DTO:', roleDTO,"id",id);
    const response = await axios.put(`http://localhost:8081/roles/update/${id}`,roleDTO);
    console.log('update res:', response.data);
    setEditedRoleName('');
    setEditedSalary('');
    const fetchRoles = await axios.get('http://localhost:8081/roles');
    console.log('fetch roles after update',fetchRoles)
    setEdit(null);
    setRoles(fetchRoles.data);
  }
  const handleRoleSubmit = async (event) =>{
    event.preventDefault();
    const roleDTO = {
      roleName,
      salary: Number(salary)
    }
    console.log('Role DTO:', roleDTO);
    const response = await axios.post('http://localhost:8081/roles/add',roleDTO);
    console.log('role post res:', response.data);
    setRoleName('');
    setRoleId('');
    setSalary('');
    const fetchRoles = await axios.get('http://localhost:8081/roles');
    console.log('Fetched roles:', fetchRoles.data);
    setRoles(fetchRoles.data);

  }
  return (
    <div>
      <h2 className="rolesHeader">Roles</h2>
      <div className="rolesContainer">

          {roles.map((role, index) => (
            edit === role.id?(
              <form key={role.id} onSubmit = {(e)=>handleEditRoleSubmit(e,role.id,role)}>

                <label>
                    Edit Role Name:
                    <input type="text" value={editedRoleName}
                        onChange={(e) => setEditedRoleName(e.target.value)}/>
                </label>

                <label>
                    Edit Salary:
                    <input type="number" value={editedSalary} onChange={(e) => setEditedSalary(e.target.value)}/>
                </label>

            <button type="submit">Submit Changes</button>


        </form>
            ):(
              <>

              <div className="role" key={role.id}>
                  <p>Role Name: {role.roleName}</p>
                  <p>Salary: {role.salary}</p>
                  <button onClick={()=>handleEditRoleClick(role)}>Edit</button>
                  <button onClick={()=>handleDeleteRoleClick(role.id)}>Delete</button>
              </div>
              </>


            )

          ))}
      </div>
      <h2 className="addRole">Add Role</h2>
      <form className= "roleForm" onSubmit = {handleRoleSubmit}>

                <label>
                    Role Name:
                    <input type="text" value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}/>
                </label>

                <label className="salary">
                    Salary:
                    <input type="number" value={salary} onChange={(e) => setSalary(e.target.value)}/>
                </label>

            <button type="submit">Add Role</button>


        </form>
    </div>



  );
}

export default Role;