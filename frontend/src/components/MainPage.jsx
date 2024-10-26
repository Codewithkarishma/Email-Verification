import React from 'react'
import "./styles.css";
import { useNavigate} from "react-router-dom"


function MainPage() {
  const navigate = useNavigate();
  return (
    <div className='main-page-container'>
      <h1>Welcome ! Please Register or Login</h1>
      <div className="button-container">
        <button className='main-button' onClick={() => navigate('/register')}>Register</button>
        <button className='main-button' onClick={() => navigate('/login')}>Login</button>
        

      </div>

      
    </div>
  )
}

export default MainPage
