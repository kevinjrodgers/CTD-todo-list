import { useState } from "react";

function Logon({ onSetEmail , onSetToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingOn, setIsLoggingOn] = useState(false); // Shows loading state during login

  async function handleSubmit() {
    try {
      event.preventDefault();
      setIsLoggingOn(true);
      const response = await fetch('/api/users/logon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      //console.log(data);
      if(response.status === 200 && data.name && data.csrfToken) {
        onSetEmail(data.name);
        onSetToken(data.csrfToken);
      } else {
        setAuthError(`Authentification failed: ${data?.message}`);
        //console.log(authError);
      }
    } catch (error) {
      setAuthError(`Error: ${error.name} | ${error.message}`);
      //console.log(authError);
    } finally {
      setIsLoggingOn(false);
    }
  }

  return (
    <form>
      <label htmlFor="email">Email</label>
      <input type="text" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>

      <label htmlFor="password">Password</label>
      <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}required/>
      {isLoggingOn ? <button type="submit" disabled>Logging in...</button> : <button type="submit" onClick={handleSubmit}>Log On</button>}
    </form>
  );
}

export default Logon;