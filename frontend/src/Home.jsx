import React from 'react'
import  "./components/styles.css";
import { toast} from "react-toastify";
import {useNavigate} from "react-router-dom"


function Home() {
  const navigate = useNavigate();

  const handleLogout = () =>{
    localStorage.removeItem('token');

    toast.success("User Logged out Successfully");
    navigate("/");
  }
  return (
    <div className='home-container'>
      <h1>Welcome to Home Page</h1>
      <button onClick={handleLogout} className='logout-button'>Logout</button>
      
    </div>
  )
}

export default Home
