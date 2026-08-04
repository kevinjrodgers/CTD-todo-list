import './App.css';
import TodoList from './TodoList.jsx';
import TodoForm from './TodoForm.jsx';
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
    let updatedTodoList = todoList.map((todo) => {
      if(todo.id === id) {
        return {...todo, isCompleted: true};
      } else {
        return todo;
      }
    });
    setTodoList(updatedTodoList);
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
