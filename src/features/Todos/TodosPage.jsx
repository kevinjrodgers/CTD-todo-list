import { useState, useEffect, useCallback } from 'react';
import TodoForm from './TodoForm.jsx';
import TodoList from './TodoList/TodoList.jsx';
import SortBy from '../../shared/SortBy.jsx';
import useDebounce from '../../utils/useDebounce.js';
import FilterInput from '../../shared/FilterInput.jsx';


function TodosPage({ token }) {
  
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState('');
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterTerm, setFilterTerm] = useState('');
  const debouncedFilterTerm = useDebounce(filterTerm, 300);
  const [dataVersion, setDataVersion] = useState(0);
  const [filterError, setFilterError] = useState('');

  useEffect(() => {
    const fetchTodos = async() => {
      setError('');
      setIsTodoListLoading(true);
      try {
        const paramsObject = {
          sortBy,
          sortDirection,
          limit: 100,
        };
        if(debouncedFilterTerm) {
          paramsObject.find = debouncedFilterTerm;
        }
        const params = new URLSearchParams(paramsObject);

        const response = await fetch(`/api/tasks?${params}`, {
          headers: {
            'X-CSRF-TOKEN': token,
          },
          credentials: 'include'
        });
        if(response.status === 200) {
          const data = await response.json();
          setTodoList(data.tasks);
          setFilterError('');
        }
        else if(response.status === 401) {
          throw new Error('Unauthorized access.');
        }
        else {
          throw new Error('Cannot fetch todos');
        } 
      } catch(error) {
        if(debouncedFilterTerm || sortBy !== 'createdAt' || sortDirection !== 'desc') {
          setFilterError(`Error filtering/sorting todos: ${error.message}`);
        } else {
          setError(`Error fetching todos: ${error.message}`);
        }
      } finally {
        setIsTodoListLoading(false);
      }
    }
    if(token) {
      fetchTodos();
    } 
  }, [token, sortBy, sortDirection, debouncedFilterTerm]);


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
        invalidateCache();
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
    const updatedTodoList = todoList.map((todo) => {
      if(todo.id === id) {
        originalTodo = {...todo};
        return {...todo, isCompleted: true};
      } else {
        return todo;
      }
    })
    setTodoList(updatedTodoList);
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
      invalidateCache();
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
    const updatedTodoList = todoList.map((todo) => {
      if(todo.id === editedTodo.id) {
        originalTodo = {...todo};
        return {...editedTodo};
      } else {
        return todo;
      }
    })
    setTodoList(updatedTodoList);
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
      invalidateCache();
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

  function handleFilterChange(filterTerm) {
    setFilterTerm(filterTerm);
  }

  const invalidateCache = useCallback(() => {
    setDataVersion(prev => prev + 1);
  }, []);

  return (
    <>
      {error ? 
      <section>
          <p>{error}</p> 
          <button onClick={() => setError('')}>Clear Error</button>
      </section> 
      : null}
      {filterError ? 
        <div>
          <p>{filterError}</p>
          <button type='button' onClick={() => setFilterError('')}>Clear Filter Error</button>
          <button 
            type='button'
            onClick={() => {
              setFilterTerm('');
              setSortBy('createdAt');
              setSortDirection('desc');
              setFilterError('');
            }}
          >
           Reset Filters
          </button>
        </div> 
        : <></>}
      {isTodoListLoading ? <p>Loading...</p> : null}
      <SortBy sortBy={sortBy} sortDirection={sortDirection} onSortByChange={setSortBy} onSortDirectionChange={setSortDirection}/>
      <FilterInput filterTerm={filterTerm} onFilterChange={handleFilterChange}></FilterInput>
			<TodoForm onAddTodo={addTodo}/>
			<TodoList todoList={todoList} dataVersion={dataVersion} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo}/>
      
    </>
  );
}

export default TodosPage;