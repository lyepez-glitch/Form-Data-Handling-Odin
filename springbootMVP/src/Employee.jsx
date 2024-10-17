import { useState } from 'react';
import axios from 'axios';
import Review from './Review';
import Promote from './Promote';

function Employee({ employees,setEmployees,setAudits,setReviews,reviews,review,setReview }) {
    const [employeeName, setEmployeeName] = useState('');
    const [departmentId, setDepartmentId] = useState('');
    const [roleId, setRoleId] = useState('');
    const [salary, setSalary] = useState('');
    const[edit,setEdit] = useState(null);
    const [editedEmployeeName,setEditedEmployeeName] = useState('');
    const [editedDepartmentId,setEditedDepartmentId] = useState('');
    const [editedRoleId,setEditedRoleId] = useState('');
    const [editedSalary,setEditedSalary] = useState('');
    const [reviewComments,setReviewComments] = useState('')
    const [reviewScore,setReviewScore] = useState('')
    const [reviewDate,setReviewDate] = useState('')
    const [editReview,setEditReview] = useState('')
    const [editedReviewComments,setEditedReviewComments] = useState('')
    const [editedReviewScore,setEditedReviewScore] = useState('')
    const [editedReviewDate,setEditedReviewDate] = useState('')
  const handleReviewEditClick = async(id) =>{
    setEditReview(id);
  }
  const handleReviewClick = async(id) =>{
    setReview(id);
  }

  const handleDeleteClick = async(id) =>{
    const response = await axios.delete(`http://localhost:8081/employees/delete/${id}`);
    console.log('delete res:', response.data);
    const fetchEmps = await axios.get('http://localhost:8081/employees');
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
  const handleReviewEditSubmit = async(review)=>{
    event.preventDefault();

    const editedReviewDTO = {
      employeeId: review.employeeId,
      reviewComments:editedReviewComments,
      reviewScore: editedReviewScore,
      reviewDate: editedReviewDate
    }
    console.log('Edited Review DTO:', editedReviewDTO);
    const response = await axios.put(`http://localhost:8081/reviews/update/${id}`,editedReviewDTO);
    console.log('update res:', response.data);


    setEditedReviewComments('');
    setEditedReviewScore('');
    setEditedReviewDate('');


    const fetchReviews = await axios.get('http://localhost:8081/reviews');


    setEditReview(null);
    setReviews(fetchReviews.data);
  }

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
    const response = await axios.put(`http://localhost:8081/employees/update/${id}`,employeeDTO);
    console.log('update res:', response.data);


    setEditedEmployeeName('');
    setEditedDepartmentId('');
    setEditedRoleId('');
    setEditedSalary('');
    const fetchEmps = await axios.get('http://localhost:8081/employees');
    const fetchAudits = await axios.get('http://localhost:8081/employeeAudits');
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
    const response = await axios.post('http://localhost:8081/employees/add',employeeDTO);
    console.log('post res:', response.data);
    setEmployeeName('');
    setDepartmentId('');
    setRoleId('');
    setSalary('');
    const fetchEmps = await axios.get('http://localhost:8081/employees');
    setEmployees(fetchEmps.data);


  }


  const handleReviewSubmit = async (event,id) =>{
    event.preventDefault();
    const reviewDTO = {
      employeeId: id,
      reviewComments,
      reviewScore,
      reviewDate
    }
    console.log('Review DTO:', reviewDTO);
    const response = await axios.post('http://localhost:8081/reviews/add',reviewDTO);
    console.log('post res:', response.data);
    setReviewComments('');
    setReviewScore('');
    setReviewDate('');
    const fetchReviews = await axios.get('http://localhost:8081/reviews');
    console.log('fetchReviews ',fetchReviews)
    setReviews(fetchReviews.data);

  }

  return (
    <div>
      <h2>Employees</h2>
      <div className="empsContainer">

          {employees.map((emp, index) => (
            edit === emp.id?(
              <form className="editEmpForm" key={emp.id} onSubmit = {(e)=>handleEditSubmit(e,emp.id)}>

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
              <div className="empsContainer">
                <div className="emp" key={emp.id}>
                  <p>Employee Name: {emp.employeeName}</p>
                  <p>Salary: {emp.salary}</p>
                  <button onClick={()=>handleEditClick(emp)}>Edit</button>
                  <button onClick={()=>handleDeleteClick(emp.id)}>Delete</button>
                  <Promote setEmployees={setEmployees} employees={employees} emp={emp}/>

                  {/* <button onClick={()=>handleReviewClick(emp.id)}>Add Review</button> */}
                  <Review setReviews={setReviews} emp={emp} reviews={reviews} />



              </div>
              </div>


            )

          ))}
      </div>
      <h2 className="addEmp">Add Employee</h2>
      <form className="empForm" onSubmit = {handleSubmit}>

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


                <label className="salary">
                    Salary:
                    <input type="number" value={salary} onChange={(e) => setSalary(e.target.value)}/>
                </label>

            <button type="submit">Add Employee</button>


        </form>
    </div>



  );
}

export default Employee;
