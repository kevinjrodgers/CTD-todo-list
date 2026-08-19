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
        //console.log(response);
        if(response.status === 401) {
          setError('Unauthorized');
        } 
        if(response.status !== 200) {
          setError('Error');
        }
        const data = await response.json();
        setTodoList(data.tasks);
      } catch(error) {
        console.log(error.message);
        setError(error.message);
      } finally {
        setIsTodoListLoading(false);
      }
    }
    fetchTodos();
  }, [token]);

  async function addTodo(todoTitle) {
    try {
      let newTodo = {
        id: Date.now(),
        title: todoTitle,
        isCompleted: false
      };
      let backupTodoList = [...todoList];
      setTodoList(previous => [newTodo, ...previous]);
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token
        },
        credentials: 'include',
        body: JSON.stringify({title: newTodo.title, isCompleted: newTodo.isCompleted}),
      });
      if(response.status === 201) {
        console.log(`Response: ${response}`);
        const data = await response.json();
        setTodoList([data.tasks[0], ...todoList]);
        console.log(`Data ${data}`);
      } else {
        console.log(error.message);
        setTodoList(backupTodoList);
        setError('Failed to upload todo');
      }
    } catch(error) {
      console.log(error.message);
    }
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