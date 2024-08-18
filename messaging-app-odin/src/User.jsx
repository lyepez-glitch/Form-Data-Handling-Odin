function Users({user,users}){
  const handleSignUp = (e) =>{
    const response = await fetch('./localhost:3000/signUp');
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
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