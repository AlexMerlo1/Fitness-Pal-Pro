import React from 'react'
import { useState } from 'react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    
  }
  return (
    <div className='wrapper'>
      <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          {error && <p className="error-message">{error}</p>}
          <div className='input-box'>
              <input 
                  type='text' 
                  placeholder='Email' 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
              />
          </div>
          <div className='input-box'>
              <input 
                  type='password' 
                  placeholder='Password' 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
              />
          </div>
          <button type="submit">Login</button>
          <div className="login-link">
              <p>Need an account? <a href='../register'>Register</a></p>
          </div>
      </form>
    </div>
  )
}

export default LoginForm