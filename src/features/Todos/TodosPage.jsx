import { useState, useEffect } from 'react';
import TodoForm from './TodoForm.jsx';
import TodoList from './TodoList/TodoList.jsx';

function TodosPage({ token }) {
  
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState('');
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);

  useEffect(() => {
    const fetchTodos = async() => {
      setIsTodoListLoading(true);
      try {
        const params = new URLSearchParams({
          limit: 100,
        });
        const response = await fetch(`/api/tasks?${params}`, {
          headers: {
            'X-CSRF-TOKEN': token,
          },
          credentials: 'include'
        });
        if(response.status === 200) {
          const data = await response.json();
          setTodoList(data.tasks);
        }
        else if(response.status === 401) {
          throw new Error('Unauthorized.');
        }
        else {
          throw new Error('Cannot fetch todos');
        } 
      } catch(error) {
        setError(`Error: ${error.name} | ${error.message}`);
      } finally {
        setIsTodoListLoading(false);
      }
    }
    if(token) {
      fetchTodos();
    } 
  }, [token]);

  async function addTodo(todoTitle) {
    let newTodo = {
        id: Date.now(),
        title: todoTitle,
        isCompleted: false
      };
    setIsTodoListLoading(true);
    try {
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
        const data = await response.json();
        setTodoList(previous => previous.map((todo) => {
          if(todo.id === newTodo.id) {
            return data;
          } else {
            return todo;
          }
        }));
      } else {
        throw new Error('Failed to add new todo');
      }
    } catch(error) {
      setTodoList(previous => previous.filter((todo) => todo.id !== newTodo.id));
      setError(error.message);
    } finally {
      setIsTodoListLoading(false);
    }
  }

  async function completeTodo(id) {
    let originalTodo;
    setTodoList(previous => previous.map((todo) => {
        if(todo.id === id) {
          originalTodo = {...todo};
          return {...todo, isCompleted: true};
        } else {
          return todo;
        }
    }));
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': token
        },
        credentials: 'include',
        body: JSON.stringify({isCompleted: true}),
      });
      if(response.status !== 200) {
        throw new Error('Unexpected error: Failed to complete selected Todo');
      }
    } catch(error) {
      setTodoList(previous => previous.map((todo) => {
          if(todo.id === originalTodo.id) {
            return {...originalTodo};
          } else {
            return todo;
          }
      }));
      setError(error.message);
    } 
  }

  async function updateTodo(editedTodo) {
    let originalTodo;
    setTodoList(previous => previous.map((todo) => {
        if(todo.id === editedTodo.id) {
          originalTodo = {...todo};
          return { ...editedTodo };
        } else {
          return todo;
        }
    }));
    try {
      const response = await fetch(`/api/tasks/${editedTodo.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': token
        },
        credentials: 'include',
        body: JSON.stringify({title: editedTodo.title, isCompleted: editedTodo.isCompleted})
      });
      if(response.status !== 200) {
        throw new Error('Failed to update selected Todo');
      } 
    } catch (error) {
      setTodoList(previous => previous.map((todo) => {
          if(todo.id === editedTodo.id) {
            return {...originalTodo};
          } else {
            return todo;
          }
        }));
      setError(error.message);
    } 
  }

  return (
    <>
      {error ? 
      <section>
          <p>{error}</p> 
          <button onClick={() => setError('')}>Clear Error</button>
      </section> 
      : null}
      {isTodoListLoading ? <p>Loading...</p> : null}
			<TodoForm onAddTodo={addTodo}/>
			<TodoList todoList={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo}/>
    </>
  );
}

export default TodosPage;