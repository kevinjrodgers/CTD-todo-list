import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/LoginPage.module.css';
import { MAX_TODO_LENGTH } from '../constants/config.js';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingOn, setIsLoggingOn] = useState(false); // Shows loading state during login
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get intended destination from location state, default to /todos
  //const from = location.state?.from?.pathname || '/todos';
  const from = location.state?.from?.pathname || '/todos';

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
      navigate(from, { replace: true });
    } else {
      setAuthError(result.error);
    }
    setIsLoggingOn(false);
  }

  return (
    <main className={styles.loginMain}>
      <h2>Login</h2>
      <form className={styles.loginForm} onSubmit={(e) => handleSubmit(e)}>
        {authError ? <p>{authError}</p> : <></>}
        <div className={styles.loginFormDiv}>
          <label htmlFor='email'>Email</label>
          <input type='text' id='email' value={email} onChange={(e) => setEmail(e.target.value)} maxLength={MAX_TODO_LENGTH} required/>
          <label htmlFor='password'>Password</label>
          <input type='password' id='password' value={password} onChange={(e) => setPassword(e.target.value)} maxLength={MAX_TODO_LENGTH} required/>
        </div>
        <button type='submit' disabled={isLoggingOn}>
          {isLoggingOn ? 'Logging in...' : 'Log On'}
        </button>
      </form>
    </main>
  );
}

export default LoginPage;