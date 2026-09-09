// This component is a wrapper component that protects routes that require authentication
import { useLocation, useNavigate } from 'react-router';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

function RequireAuth( { children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    if(!isAuthenticated) {
      navigate('/login', { 
        state: {
          from: location,
        },
      }); 
    }
  }, [isAuthenticated, navigate, location]);

  return (
    <>
      { isAuthenticated ? children : <p>Page requires log in, redirecting...</p>}
    </>
    
  );
}

export default RequireAuth;