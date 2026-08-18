import { useState } from 'react';
import TodoForm from './TodoForm.jsx';
import TodoList from './TodoList/TodoList.jsx';

function TodosPage() {
  
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

  function updateTodo(editedTodo) {
    let updatedTodos = todoList.map((todo) => {
      if(todo.id === editedTodo.id) {
        return { ...editedTodo };
      } else {
        return todo;
      }
    })
    setTodoList(updatedTodos);
  }

  return (
    <>
			<TodoForm onAddTodo={addTodo}/>
			<TodoList todoList={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo}/>
    </>
  );
}

export default TodosPage;