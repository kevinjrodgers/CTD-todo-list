import './App.css';
import { useState } from 'react';
import TodosPage from './features/Todos/TodosPage.jsx';
import Header from './shared/Header.jsx';
import Logon from './features/Logon.jsx';

function App() {

	return (
		<div>
      <Header/>
      <TodosPage/>
      <Logon/>
		</div>
	);
}

export default App;
