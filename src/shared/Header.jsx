import { useAuth } from "../contexts/AuthContext";
import Logout from "../features/Logout";
function Header() {
  const { isAuthenticated } = useAuth();
  return (
    <div>
      <h1>Todo List</h1>
      {isAuthenticated ? <Logout /> : <></>}
    </div>
  );
}

export default Header;