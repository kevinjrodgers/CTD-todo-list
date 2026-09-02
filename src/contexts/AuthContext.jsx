import { createContext, useContext, useState } from 'react';

//Create the context
const AuthContext = createContext();

export function AuthProvider({ children }) {
  //State for authentication
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
 
  // Functions will go here...
  const login = async (userEmail, password) => {
    try {
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, password }),
        credentials: 'include',
      };
      const response = await fetch('/api/users/logon', options);
      const data = await response.json();
      
      if (response.status === 200 && data.name && data.csrfToken) {
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

  const logout = async () => {
    if(token) {
      try {
        const response = await fetch(`/api/users/logoff`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token,
          }
        });
        const data = await response.json();
        setEmail('');
        setToken('');
        if(response.status === 200) {  
          return { success: true };
        } else {
          return {
            success: false,
            error: `Clear auth failed: ${data?.message}`,
          }
        }
      } catch (error) {
        return {
          success: false,
          error: 'Network error durring logout',
        }
      }
    } else {
      // Just clear local state
      setEmail('');
      setToken('');
    }
  }

  // Context value object
  const value = {
    email,
    token,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

//Custom hook with error checking
export function useAuth() {
  const context = useContext(AuthContext);
  console.log('Auth context:', context); // Remove this later
  if(!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
