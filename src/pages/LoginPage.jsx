import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/LoginPage.module.css';
import { z } from 'zod';
import DOMPurify from 'dompurify';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingOn, setIsLoggingOn] = useState(false); // Shows loading state during login
  const { login, isAuthenticated } = useAuth();
  const [userInputErrors, setUserInputErrors] = useState([]);
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
    setUserInputErrors([]);
    setAuthError('');
    setIsLoggingOn(true);
    // Validate and sanitize inputs
    const emailChecker = emailSanitizer(email);
    const passwordChecker = passwordSanitizer(password);
    if(emailChecker.isValid && passwordChecker.isValid) {
      const result = await login(emailChecker.sanitizedEmail, passwordChecker.sanitizedPassword);
      if(result.success) {
      setIsLoggingOn(false);
      navigate(from, { replace: true });
      } else {
        setAuthError(result.error);
      }
    }
    setIsLoggingOn(false);
  }

  function emailSanitizer(userEmailInput) {
    // email() is a default Zod function that uses regex to validate input
    // Zod returns a deep clone of the input
    try {
      const emailSchema = z.email({
        message: 'Invalid email address'
      });
      const validatedEmailInput = emailSchema.parse(userEmailInput);
      // Use DOMPurify to sanitize valid input
      const sanitizedEmail = DOMPurify.sanitize(validatedEmailInput);
      //setEmail(sanitizedEmail);
      return {
        isValid: true,
        sanitizedEmail: sanitizedEmail,
      }
    } catch(error) {
      setUserInputErrors(previous => [...previous, error.issues[0].message]);
      return {
        isValid: false,
      };
    }
  }

  function passwordSanitizer(userPasswordInput) {
    try {
      const passwordSchema = z.string().refine((value) => value.trim().length > 0, 'Password field cannot be empty');
      const validatedPasswordInput = passwordSchema.parse(userPasswordInput);
      const sanitizedPassword = DOMPurify.sanitize(validatedPasswordInput);
      return {
        isValid: true,
        sanitizedPassword: sanitizedPassword,
      }
    } catch(error) {
      setUserInputErrors(previous => [...previous, error.issues[0].message]);
      return {
        isValid: false
      };
    }
  }

  return (
    <main className={styles.loginMain}>
      <h2>Login</h2>
      <form className={styles.loginForm} onSubmit={(e) => handleSubmit(e)}>
        {authError ? <p className='errorText'>{authError}</p> : <></>}
        {userInputErrors.length > 0 ? 
          userInputErrors.map((error) => {
            return <p className='errorText'>* {error}</p>
          }) : <></>}
        <div className={styles.loginFormDiv}>
          <label htmlFor='email'>Email</label>
          <input type='email' id='email' value={email} onChange={(e) => setEmail(e.target.value)} required/>
          <label htmlFor='password'>Password</label>
          <input type='password' id='password' value={password} onChange={(e) => setPassword(e.target.value)} required/>
        </div>
        <button type='submit' disabled={isLoggingOn}>
          {isLoggingOn ? 'Logging in...' : 'Log On'}
        </button>
      </form>
    </main>
  );
}

export default LoginPage;