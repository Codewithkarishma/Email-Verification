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
      const response = await axios.post('http://localhost:5000/register', {email, password});
      toast.success(response.data.message);
      setEmail('');
      setPassword('');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration Failed';
      toast.error(errorMessage);
    }
  }
  return (
    <div className='container'>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder='Email' value={email} onChange={(e) =>setEmail(e.target.value)} required />
        <input type='password' placeholder='password' value={password} onChange={(e) =>setPassword(e.target.value)} required />
        <button type="submit" className='main-button'>Register</button>
      </form>
      <p>Already have an Account <Link to="/login">Login here</Link></p>
    </div>
  )
}

export default Register
