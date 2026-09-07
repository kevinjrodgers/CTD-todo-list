import './App.css';
import { Routes, Route } from 'react-router';
import TodosPage from './pages/TodosPage.jsx';
import Header from './shared/Header.jsx';
import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
// import { useAuth } from './contexts/AuthContext.jsx';

function App() {

  //const { isAuthenticated } = useAuth();

	return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/about' element={<AboutPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/todos' element={<TodosPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </>
      
	);
}

export default App;
