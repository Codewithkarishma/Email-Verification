import React, { useEffect } from 'react'
import {useNavigate, useParams } from 'react-router-dom'
import axios from "axios"
import {toast} from "react-toastify"
function Verification() {

  const {token} = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
        console.log('Attempting to verify with token:', token);
        try {
            const response = await axios.get(`https://email-verification-backend.onrender.com/verify/${token}`);
            console.log('Verification response:', response.data);

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                toast.success("Email Verified Successfully & You are Logged in");
                navigate('/home');
            }
        } catch (error) {
            console.error('Verification error:', error);
            if (error.response) {
                // Server responded with a status other than 200
                toast.error(`Error: ${error.response.data}`);
            } else if (error.request) {
                // Request was made but no response received
                toast.error("No response received from server.");
            } else {
                // Something happened in setting up the request
                toast.error(`Error: ${error.message}`);
            }
            navigate('/');
        }
    };
    verifyEmail();
}, [token, navigate]);

  return (
    <div className='container verification-container'>
      <p>Verifying Your Email.....</p>
      
    </div>
  )
}

export default Verification
