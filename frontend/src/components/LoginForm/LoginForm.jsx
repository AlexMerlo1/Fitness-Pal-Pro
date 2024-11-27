import React, { useState } from 'react';
import './LoginForm.css'; 
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // Success message

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Clear previous errors
    setError('');
    setSuccess(''); // Clear success message when submitting

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      // Send login request to flask api
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Login successful!'); // Set success message
        setError('');
        setEmail(''); // Clear email field
        setPassword(''); // Clear password field

        // Store the token in localStorage
        localStorage.clear();
        console.log('API Response:', data);    
        localStorage.setItem('token', data.token);
        //localStorage.setItem('token', data.token);
        localStorage.setItem('user_id', data.user_id);
        localStorage.setItem('userID', data.user_id);
        
        // Redirect to home page
        navigate('/home');
      } else {
        setError(data.message || 'An error occurred');
        setSuccess('');
      }
    } catch (err) {
      setError('Failed to login. Please try again.');
      setSuccess('');
    }
  };

  return (
    <div className='wrapper'>
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>} {/* Display success message */}
        <div className='input-box'>
          <input
            type='email'
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
