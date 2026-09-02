import './App.css';
import { useState } from 'react';
import TodosPage from './features/Todos/TodosPage.jsx';
import Header from './shared/Header.jsx';
import Logon from './features/Logon.jsx';
import { useAuth } from './contexts/AuthContext.jsx';

function App() {

  //const { email } = useAuth();
  //const { token } = useAuth();
  const { isAuthenticated } = useAuth();

	return (
    <div>
      <Header /*token={token} onSetToken={setToken} onSetEmail={setEmail}*/ />
      {/*token*/isAuthenticated ? <TodosPage /* token={token}*/ /> : <Logon /*onSetEmail={setEmail} onSetToken={setToken}*/ />}
    </div>
	);
}

export default App;
