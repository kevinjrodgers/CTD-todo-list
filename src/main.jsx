import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthContext } from '../src/contexts/AuthContext.jsx';

export function AuthProvider({ children }) {
  //State for authentication
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');

    // Functions will go here...

    // Context value object
    const value = {
      email,
      token,
      isAuthenticated: !!token,
      login,
      logout,
    };

    const login = async (userEmail, password) => {
      try {
        const options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userEmail, password }),
          credentials: 'include',
        };
        
        const res = await fetch('/api/users/logon', options);
        const data = await res.json();
        
        if (res.status === 200 && data.name && data.csrfToken) {
          // Success: Update state
          setEmail(data.name);
          setToken(data.csrfToken);
          return { success: true };
        } else {
          // Failure: Return error
          return {
            success: false,
            error: `Authentication failed: ${data?.message}`,
          };
        }
      } catch (error) {
        return {
          success: false,
          error: 'Network error during login',
        };
      }
    };


    return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    );

}


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
