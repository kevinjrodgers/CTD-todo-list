import { useAuth } from "../contexts/AuthContext";
function Logoff() {
  const { logout } = useAuth();

  async function handleLogout(event) {
    event.preventDefault();
    const result = await logout();
    if(result.success) {
      console.log("Successfully logged out");
    } else {
      console.log(result.message);
    }
  } 

  return (
    <button type='button' onClick={(e) => handleLogout(e)}>Log Out</button>
  );
}

export default Logoff;