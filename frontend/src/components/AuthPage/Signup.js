import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const Signup = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    // Add signup logic here
    console.log('Signing up with:', { userName, email, password });
    try {
      const response = await fetch("http://127.0.0.1:5000/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 'username' : userName, 'email': email, 'password': password }),
      }) 
      const data = await response.json();
      console.log(data);
      if (data.message){
        navigate('/login'); 
      } 
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="auth-container">
      <h1>Create an Account</h1>
      <form onSubmit={handleSignup} className="auth-form">
        <input
          type="text"
          id="userName"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter your username"
          required
        />

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
        <button type="submit" className="submit-btn">Sign Up</button>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
