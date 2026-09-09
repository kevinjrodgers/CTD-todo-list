import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';


function Logoff() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOff, setIsLoggingOff] = useState(false);
  const [error, setError] = useState('');

  async function handleLogoff(event) {
    event.preventDefault();
    setIsLoggingOff(true);
    setError('');
    const result = await logout();
    console.log(result);
    if(result.success) {
      
      navigate('/login');
    } else {
      setError(result.error);
      setIsLoggingOff(false);
    }
  } 

  return (
    <>
      {isLoggingOff ? <p>Logging off...</p> : <></>}
      {error ? <p>{error}</p> : <></>}
      <button type='button' onClick={(e) => handleLogoff(e)}>Log Out</button>
    </>
    
  );
}

export default Logoff;