import { useState } from 'react'


function Users({user}){

  const [users,setUsers] = useState([{name: 'Lucas'}])
  const handleSignUp = async (e) =>{
    const response = await fetch('http://localhost:3000/users/signUp',{
      method: 'GET',
      headers:{'Content-Type': 'application/json'}
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    console.log('res',response)
    const json = await response.json();
    console.log('json',json)
  }
  return (
    <>
    {user?(
      users.map(user =>{
        <div>{user.name}</div>
        }
        )
    ): (
      <div>
        <button onClick = {handleSignUp}>Sign Up</button>
      </div>
    )

  }

    </>
  )
}
export default Users;