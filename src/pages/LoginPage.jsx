import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingOn, setIsLoggingOn] = useState(false); // Shows loading state during login
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get intended destination from location state, default to /todos
  const from = location.state?.from?.path || '/todos';

   // Redirect if already authenticated
  useEffect(() => {
    if(isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Handle login form submission
  async function handleSubmit(event) {
    event.preventDefault();
    setAuthError('');
    setIsLoggingOn(true);
    const result = await login(email, password);
    if(result.success) {
      setIsLoggingOn(false);
    } else {
      setAuthError(result.error);
    }
    setIsLoggingOn(false);
  }

  return (
    <>
      {authError ? <p>{authError}</p> : <></>}
      <form onSubmit={(e) => handleSubmit(e)}>
      
      <label htmlFor="email">Email</label>
      <input type="text" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>

      <label htmlFor="password">Password</label>
      <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}required/>
      
      <button type="submit" disabled={isLoggingOn}>
        {isLoggingOn ? 'Logging in...' : 'Log On'}
      </button>
    </form>
    </>
  );
}

export default LoginPage;