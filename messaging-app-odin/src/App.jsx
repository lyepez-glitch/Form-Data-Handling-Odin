import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Users from './User.jsx'

function App() {
  const [user, setUser] = useState(null);
  const users = [{name: 'Lucas'}]

  return (
    <>
      <Users user = {user} users= {users}/>
    </>
  )
}

export default App
