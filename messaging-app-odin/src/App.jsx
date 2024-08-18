import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Users from './User.jsx'

function App() {
  const [user, setUser] = useState(null);


  return (
    <>
      <Users user = {user}/>
    </>
  )
}

export default App
