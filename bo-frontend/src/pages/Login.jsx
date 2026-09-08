import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth';

export default function Login() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null); // Clear any previous errors
    
    try {
      const res = await login(userName, password);
      
      // Store standard auth data. 
      // Note: ASP.NET Core serializes C# properties to camelCase by default (token, userName, role)
      localStorage.setItem('token', res.token);
      localStorage.setItem('userName', res.userName);
      localStorage.setItem('role', res.role);

      // Route the user based on their specific role in the system
      switch (res.role) {
        case 'BO':
          navigate('/bo-dashboard');
          break;
        case 'Employee':
          navigate('/employee-dashboard');
          break;
        case 'ResourcePlanner':
          navigate('/planner-dashboard');
          break;
        case 'OSE':
          navigate('/ose-dashboard');
          break;
        default:
          navigate('/'); // Fallback if no specific role matches
      }
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>BME Portal Login</h2>
        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input 
            type="text"
            value={userName} 
            onChange={e => setUserName(e.target.value)} 
            required 
          />
          
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
          
          <button className="btn primary" type="submit">Sign in</button>
          
          {error && <div className="error" style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
        </form>
      </div>
    </div>
  );
}