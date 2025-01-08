import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    // Add authentication logic here
    console.log('Logging in with:', { email, password });
    try {
      const response = await fetch("http://127.0.0.1:5000/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({'email': email, 'password': password }),
      }) 
      const data = await response.json();
      if (data.access_token){
        console.log(data);
        localStorage.setItem('accessToken', data.access_token);
        navigate('/dashboard'); 
      } 
      else{
        alert("Incorrect credentials");
      }
    } catch (error) {
      alert("Internal server error");
      console.error(error);
    } // Redirect to the dashboard upon successful login
  };

  return (
    <div className="auth-container">
      <h1>Login to AI-Academy</h1>
      <form onSubmit={handleLogin} className="auth-form">
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
        <button type="submit" className="submit-btn">Login</button>
        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
