import {useState} from 'react';
import axios from 'axios';

function Promote({emp,employees,setEmployees}){
  const [promoteSalary,setPromoteSalary] = useState('')
  const [promoteRole,setPromoteRole] = useState('')
  const [promote,setPromote] = useState('');
  const handlePromoteClick = async(event,emp)=>{
    setPromote(emp.id);
  }

  const handlePromoteSubmit = async(event,emp)=>{
    event.preventDefault();
    const promoteDTO = {
      employeeId: emp.id,
      roleId: promoteRole,
      salary: promoteSalary

    }

    console.log('PromoteDTO:', promoteDTO);
    const response = await axios.put(`http://localhost:8081/employees/promote/${emp.id}`,promoteDTO);
    console.log('promote res:', response.data);
    setPromoteSalary('');
    setPromoteRole('');
    setPromote('');
    const fetchEmployees = await axios.get('http://localhost:8081/employees');
    console.log('fetchEmployees ',fetchEmployees);
    setEmployees(fetchEmployees.data);
  }

  return (
    <>
      <div>
        {
          promote === emp.id?(
            <form className="promoteForm" key={emp.id} onSubmit = {(e)=>handlePromoteSubmit(e,emp)}>


                <label>
                    Promote Role ID:
                    <input type="number" value={promoteRole} onChange={(e) => setPromoteRole(e.target.value)}/>
                </label>


                <label>
                    Promote Salary:
                    <input type="number" value={promoteSalary} onChange={(e) => setPromoteSalary(e.target.value)}/>
                </label>

            <button type="submit">Promote</button>


        </form>

          ):(
            <button onClick={(event)=>handlePromoteClick(event,emp)}>Promote</button>
          )
        }
      </div>

    </>
  )
}
export default Promote;