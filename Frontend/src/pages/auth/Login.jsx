import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import aaibLogoNoBackground from '../../assets/images/aaib no background.png';
import aaibLogo from '../../assets/images/aaib.png';

export default function Login() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    // Explicit check for empty fields
    if (!userName.trim() || !password.trim()) {
      setError('Username and password cannot be left empty.');
      return;
    }

    setIsLoading(true);
    
    try {
      const res = await login(userName, password);
      
      localStorage.setItem('token', res.token);
      localStorage.setItem('userName', res.userName);
      localStorage.setItem('role', res.role);


      switch (res.role) {
  case 'BO':
    navigate('/bo/dashboard')
    break

  case 'ResourcePlanner':
    navigate('/resource-planner/dashboard')
    break

  case 'Employee':
    navigate('/employee/dashboard')
    break

  case 'Head':
    navigate('/vertical-head/dashboard')
    break

  case 'HeadOfPO':
    navigate('/po/dashboard')
    break

  default:
    navigate('/404')
    break
}


    } catch (err) {
      // Explicit error message for invalid credentials
      setError('Invalid credentials. Please check your username and password and try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
  <div className="auth-page">
    <div className="auth-brand">
      <img
        src={aaibLogo}
        alt="AAIB"
      />
    </div>

    <div className="auth-card">
        
        {/* Branding Header: Clean green text logo */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img
  src={aaibLogo}
  alt="AAIB"
  style={{
    width: '170px',
    height: 'auto',
    margin: '0 auto 18px',
    objectFit: 'contain'
  }}
/>
          <h2 className="aaib-title" style={{ marginBottom: '4px' }}>Welcome back</h2>
          <p className="aaib-subtitle">Sign in to your enterprise resource portal</p>
        </div>

        <form className="form" onSubmit={handleSubmit} noValidate>
          
          {/* Error Banner */}
          {error && (
            <div className="error" style={{ 
              background: 'var(--aaib-danger-soft)', 
              color: 'var(--aaib-danger)',
              padding: '12px', 
              borderRadius: '10px', 
              marginBottom: '16px',
              fontSize: '14px',
              border: '1px solid var(--aaib-danger)'
            }}>
              {error}
            </div>
          )}

          {/* Username Field with Red Asterisk */}
          <label>
            Username <span style={{ color: 'var(--aaib-danger)' }}>*</span>
          </label>
          <input 
            type="text"
            value={userName} 
            onChange={e => setUserName(e.target.value)} 
            disabled={isLoading}
            placeholder="Enter your username"
            className="aaib-input"
          />
          
          {/* Password Field with Red Asterisk */}
          <label>
            Password <span style={{ color: 'var(--aaib-danger)' }}>*</span>
          </label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            disabled={isLoading}
            placeholder="••••••••"
            className="aaib-input"
          />
          
          <div className="actions">
            <button 
              className="btn primary" 
              type="submit" 
              disabled={isLoading}
              style={{ 
                width: '100%', 
                marginTop: '12px', 
                opacity: isLoading ? 0.7 : 1, 
                cursor: isLoading ? 'not-allowed' : 'pointer' 
              }}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}