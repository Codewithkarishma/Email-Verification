import React, { useEffect } from 'react'
import {useNavigate, useParams } from 'react-router-dom'
import axios from "axios"
import {toast} from "react-toastify"
function Verification() {

  const {token} = useParams();
  const navigate = useNavigate();

  useEffect(() =>{
    const verifyEmail = async() =>{
      try {
        const response = await axios.get(`https://email-verification-backend.onrender.com/verify/${token}`);

        // only allow the toast message once
        if(response.data.token){
          localStorage.setItem('token', response.data.token);
          toast.success("Email Verified SuccessFully & You are Logged in")
          navigate('/home');
        }
        
      } catch (error) {
        const errorMessage = error.response?.data ||"Verification invalid or Expired Token";
        toast.error(errorMessage);
        navigate('/');
         
      }
    };
    verifyEmail();

  },[token,navigate])
  return (
    <div className='container verification-container'>
      <p>Verifying Your Email.....</p>
      
    </div>
  )
}

export default Verification
