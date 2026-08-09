import './App.css';
import TodoList from './features/TodoList/TodoList.jsx';
import TodoForm from './features/TodoForm.jsx';
import { useState } from 'react';

function App() {
  
	const [todoList, setTodoList] = useState([]);

  function addTodo(todoTitle) {
    let newTodo = {
      id: Date.now(),
      title: todoTitle,
	    isCompleted: false
    };
    setTodoList(previous => [newTodo, ...previous]);
  }

  function completeTodo(id) {
    setTodoList(previous => previous.map((todo) => {
      if(todo.id === id) {
        return {...todo, isCompleted: true};
      } else {
        return todo;
      }
    }));
  }

	return (
		<div>
			<h1>Todo List</h1>
			<TodoForm onAddTodo={addTodo}/>
			<TodoList todoList={todoList} onCompleteTodo={completeTodo}/>
		</div>
	);
}

export default App;
