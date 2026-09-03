import { useAuth } from "../contexts/AuthContext";
function Logout() {
  const { logout } = useAuth();

  async function handleLogout(event) {
    event.preventDefault();
    try {
      const result = await logout();
      if(result.success) {
        console.log("Successfully logged out");
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.log(error.message);
    }  
  } 

  return (
    <button type='button' onClick={(e) => handleLogout(e)}>Log Out</button>
  );
}

export default Logout;