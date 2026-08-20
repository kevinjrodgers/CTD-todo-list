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
        if(response.status === 401) {
          setError('Unauthorized');
        } 
        if(response.status !== 200) {
          setError('Error');
        }
        const data = await response.json();
        setTodoList(data.tasks);
      } catch(error) {
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
        const data = await response.json();
        setTodoList([data.tasks[0], ...todoList]);
      } else {
        setTodoList(backupTodoList);
        setError('Invalid response: Failed to add Todo');
      }
    } catch(error) {
      setError('Unexpted error: Failed to add Todo');
    }
  }

  async function completeTodo(id) {
    try {
      let originalTodo;
      for(let x = 0; x < todoList.length; x++) {
        if(id === todoList[x].id) {
          originalTodo = todoList[x];
        }
      }
      setTodoList(previous => previous.map((todo) => {
        if(todo.id === id) {
          return {...todo, isCompleted: true};
        } else {
          return todo;
        }
      }));

      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': token
        },
        body: JSON.stringify({isCompleted: true}),
      });
      if(response.status < 200 || response.status > 299) {
        setError('Invalid response: Failed to complete selected Todo');
        setTodoList(previous => previous.map((todo) => {
          if(todo.id === id) {
            return {...originalTodo};
          } else {
            return todo;
          }
        }));
      }
    } catch(error) {
      setError('Unexpected error: Failed to complete selected Todo');
    } 
  }

  async function updateTodo(editedTodo) {
    try {
      let originalTodo;
      for(let x = 0; x < todoList.length; x++) {
        if(editedTodo.id === todoList[x].id) {
          originalTodo = todoList[x];
        }
      }
      let updatedTodos = todoList.map((todo) => {
        if(todo.id === editedTodo.id) {
          return { ...editedTodo };
        } else {
          return todo;
        }
      });
      setTodoList(updatedTodos);
      const response = await fetch(`/api/tasks/${editedTodo.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': token
        },
        body: JSON.stringify({title: editedTodo.title, isCompleted: editedTodo.isCompleted})
      });
      if(response.status >= 200 && response.status < 300) {
        console.log("Update success!");
      } else {
        setError('Invalid response: Failed to Update selected Todo');
        setTodoList(previous => previous.map((todo) => {
          if(todo.id === editedTodo.id) {
            return {...originalTodo};
          } else {
            return todo;
          }
        }));
      }
    } catch (error) {
      console.log(error.message);
      setError('Unexpected error: Failed to Update selected Todo');
    } finally {
      console.log('Update Todo operation completed');
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