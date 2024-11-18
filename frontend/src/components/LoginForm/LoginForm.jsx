import React, { useState } from 'react';
import './LoginForm.css';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  // Mock credentials
  const validCredentials = {
    email: 'test@example.com',
    password: 'password123'
  };

  const handleSubmit = (event) => {
    event.preventDefault(); 

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    // Mock validation
    if (email === validCredentials.email && password === validCredentials.password) {
      setError('');
      console.log(`Logged in as: ${email}`);

      // Successful login
      navigate('/home');
    } else {
      setError('Invalid email or password');
    }
  };

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
        <div className="register-link">
          <p>Need an account? <a href='../register'>Register</a></p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
