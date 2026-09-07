import { Link } from "react-router";

function NotFoundPage() {
  return (
    <main>
      <h1>404 Page Not Found</h1>
      <p>Let's return back to the application</p>
      <Link to={'/'}>Home</Link>
    </main>
  );
}

export default NotFoundPage;