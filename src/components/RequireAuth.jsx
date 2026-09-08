// This component is a wrapper component that protects routes that require authentication
import { useLocation, useNavigate } from "react-router";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";

function RequireAuth( { children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if(!isAuthenticated) {
      navigate('/login', {location}); // Passing location in state to the LoginPage
    }
  });

  return (
    <>
      { isAuthenticated ? children : <p>Please wait, redirecting...</p>}
    </>
    
  );
}

export default RequireAuth;