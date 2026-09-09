import { Link } from "react-router";

function NotFoundPage() {
  return (
    <main>
      <h1>404 Page Not Found</h1>
      <p>Let's return back to the application</p>
      <ul style={{listStyle: 'none'}}>
        <li style={{ marginBottom: '10px'}}><Link to='/'>Home</Link></li>
        <li style={{ marginBottom: '10px'}}><Link to='/about'>About</Link></li>
        <li style={{ marginBottom: '10px'}}><Link to='/todos'>Todos</Link></li>
        <li style={{ marginBottom: '10px'}}><Link to='/profile'>Profile</Link></li>
        <li style={{ marginBottom: '10px'}}><Link to='/login'>Login</Link></li>
      </ul>
    </main>
  );
}

export default NotFoundPage;