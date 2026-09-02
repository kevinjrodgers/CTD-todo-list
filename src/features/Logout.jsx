import { useAuth } from "../contexts/AuthContext";
function Logout() {
  const { logout } = useAuth();

  async function handleLogout(event) {
    event.preventDefault();
    await logout();
  }

  return (
    <button type='button' onClick={(e) => handleLogout(e)}>Log Out</button>
  );
}

export default Logout;