import './App.css';
import { Routes, Route } from 'react-router';
import TodosPage from './features/Todos/TodosPage.jsx';
import Header from './shared/Header.jsx';
import Logon from './features/Logon.jsx';
import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
// import { useAuth } from './contexts/AuthContext.jsx';

function App() {

  //const { isAuthenticated } = useAuth();

	return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<HomePage />} />
        {<Route path='/about' element={<AboutPage />} />}
        <Route path='/login' element={<Logon />} />
        <Route path='*' />
      </Routes>
    </>
      
	);
}

export default App;
