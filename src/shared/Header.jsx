import { useAuth } from '../contexts/AuthContext.jsx';
import Logoff from '../features/Logoff.jsx';
import Navigation from './Navigation.jsx';
import { APP_NAME } from '../constants/config.js';
import styles from '../styles/Header.module.css';

function Header() {
  const { isAuthenticated } = useAuth();

  return (
    <header className={styles.headerDiv}>
      <h1>{APP_NAME}</h1>
      <div className={styles.navLinks}>
        <Navigation></Navigation>
        {isAuthenticated ? <Logoff /> : <></>}
      </div>
    </header>
  );
}

export default Header;