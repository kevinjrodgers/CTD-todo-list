import { useAuth } from "../contexts/AuthContext";

function ProfilePage() {
  const { email, token } = useAuth();

  // PUT IN API statistics
  return (
    <main>
      <h1>Hello, {email}. </h1>
      <div>
        <h3>Statistics</h3>
      </div>
    </main>
  );
}

export default ProfilePage;