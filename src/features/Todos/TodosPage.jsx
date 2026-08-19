import { useState, useEffect } from 'react';
import TodoForm from './TodoForm.jsx';
import TodoList from './TodoList/TodoList.jsx';

function TodosPage({ token }) {
  
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState('');
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);

  useEffect(() => {
    const fetchTodos = async() => {
      try {
        setIsTodoListLoading(true);
        const params = new URLSearchParams({
          limit: 100,
        });
        const response = await fetch(`/api/tasks?${params}`, {
          headers: {
            'X-CSRF-TOKEN': token,
          },
          credentials: 'include'
        });
        console.log(response);
        if(response.status === 401) {
          setError('Unauthorized');
        } 
        if(response.status !== 200) {
          setError('Error');
        }
        const data = await response.json();
        console.log(data);
      } catch(error) {
        console.log(error.message);
        setError(error.message);
      } finally {
        setIsTodoListLoading(false);
      }
    }
    fetchTodos();
  }, [token]);

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