import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Employee from './Employee.jsx';
import Role from './Role';
import Audit from './Audit';
import Department from './Department';

function App() {
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [audits, setAudits] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [review, setReview] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoggedIn, setLogin] = useState(false);
  const [isSignedUp, setSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8081/api/auth/login', {
        username,
        password,
      });
      console.log(response.data); // Handle login success
      setLogin(true); // Mark as loggedin
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8081/api/auth/signup', {
        username,
        password,
      });
      console.log(response.data); // Handle signup success
      setSignUp(true); // Mark as signed up
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:8081/employees');
        console.log('res', response);
        setEmployees(response.data);

        const roleResponse = await axios.get('http://localhost:8081/roles');
        console.log('res', roleResponse);
        setRoles(roleResponse.data);

        const auditResponse = await axios.get('http://localhost:8081/employeeAudits');
        console.log('audit res', auditResponse);
        setAudits(auditResponse.data); // Should be 'data', not 'date'
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchEmployees();
  }, []);

  return (
    <div>
      {isSignedUp && isLoggedIn ? (
        <div>
          <Employee
            review={review}
            setReview={setReview}
            setReviews={setReviews}
            reviews={reviews}
            setAudits={setAudits}
            setEmployees={setEmployees}
            employees={employees}
          />
          <Role setRoles={setRoles} roles={roles} />
          <Audit setAudits={setAudits} audits={audits} />
          <Department setDepartments={setDepartments} departments={departments} />
        </div>
      ) : isSignedUp && !isLoggedIn ? (
        <div>
          <h1>Log In</h1>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Log In</button>
          </form>
        </div>
      ) : (
        <div>
          <h1>Sign Up</h1>
          <form onSubmit={handleSignup}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Sign Up</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
