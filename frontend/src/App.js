import React from "react";
import { BrowserRouter as Router , Route, Routes} from 'react-router-dom';
import { ToastContainer } from 'react-toastify'
import MainPage from "./components/MainPage";
import Register from "./components/Register";
import Login from "./components/Login";
import Verification from "./components/Verification"
import Home from "./Home";
import 'react-toastify/dist/ReactToastify.css';

import './components/styles.css'
function App() {
  return (
   <Router>
<div>
  <ToastContainer />
  <Routes>
    <Route path="/" element={<MainPage />} />
    <Route path="/register"  element={ <Register /> }  />
    <Route path="/login"  element={ <Login /> }  />
    <Route path="/verify"  element={ <Verification /> }  />
    <Route path="/home"  element={ <Home /> }  />
  </Routes>
</div>
   </Router>
  );
}

export default App;
