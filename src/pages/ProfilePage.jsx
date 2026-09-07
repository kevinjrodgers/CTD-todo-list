import { useAuth } from "../contexts/AuthContext";

function ProfilePage() {
  const { email, token } = useAuth();

  // PUT IN API statistics
  return (
    <main>
      <h1>Hello, {email}. </h1>

    </main>
  );
}

export default ProfilePage;