import { useAuth } from '../contexts/AuthContext.jsx';
import Logoff from '../features/Logoff.jsx';
import Navigation from './Navigation.jsx';
import { APP_NAME } from '../constants/config.js';
import styles from '../styles/Header.module.css';
import { useState } from 'react';

function Header() {
  const { isAuthenticated } = useAuth();
  const [isHamburgerClicked, setIsHamburgerClicked] = useState(true);

  function hamburgerMenu() {
    setIsHamburgerClicked(!isHamburgerClicked);
  }
  return (
    <header>
      <h1>{APP_NAME}</h1>
        <nav>
          <div className={styles.navLinks}>
            <Navigation></Navigation>
            {isAuthenticated ? <Logoff /> : <></>}
          </div>
      </nav>
    </header>
  );
}

export default Header;