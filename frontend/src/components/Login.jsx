import React, { useState } from 'react'
import "./styles.css";
import { Link } from "react-router-dom"
import axios from "axios"
import { toast } from 'react-toastify'

function Register() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) =>{
    e.preventDefault();

    try {
      const response = await axios.post('https://email-verification-backend.onrender.com/login', {email, password});
      toast.success(response.data.message);
      setEmail('');
      setPassword('');

      // store the token in localhost
      localStorage.setItem('token', response.data.token);
      // redirect to home

      window.location.href = '/home';
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login Failed Please check your credentials';
      toast.error(errorMessage);
    }
  }
  return (
    <div className='container'>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder='Email' value={email} onChange={(e) =>setEmail(e.target.value)} required />
        <input type='password' placeholder='password' value={password} onChange={(e) =>setPassword(e.target.value)} required />
        <button type="submit" className='main-button'>Login</button>
      </form>
      <p>Already have an Account <Link to="/register">Register here</Link></p>
    </div>
  )
}

export default Register
