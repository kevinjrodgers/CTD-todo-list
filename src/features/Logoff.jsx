import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";


function Logoff() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogoff(event) {
    // setIsLoggingOff(true);
    // setError('');
    event.preventDefault();
    const result = await logout();
    if(result.success) {
      navigate('/login');
    } else {
      console.log(result.error);
      // setError(result.error);
      // setIsLoggingOff(false);
    }
  } 

  return (
    <button type='button' onClick={(e) => handleLogoff(e)}>Log Out</button>
  );
}

export default Logoff;