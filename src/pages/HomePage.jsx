import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext.jsx";

function HomePage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if(isAuthenticated) {
      navigate('/todos', { replace: true });
    } else {
      navigate('/logon', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div>
      <p>Redirecting...</p>
    </div>
  );
}

export default HomePage;