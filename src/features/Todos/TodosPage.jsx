import { useState, useEffect, useCallback, useReducer } from 'react';
import TodoForm from './TodoForm.jsx';
import TodoList from './TodoList/TodoList.jsx';
import SortBy from '../../shared/SortBy.jsx';
import useDebounce from '../../utils/useDebounce.js';
import FilterInput from '../../shared/FilterInput.jsx';
import { initialState, todoReducer, TODO_ACTIONS } from '../../reducers/todoReducer.js';

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

  const [state, dispatch] = useReducer(todoReducer, initialState);

  useEffect(() => {
    const fetchTodos = async() => {
      //setError('');
      //setIsTodoListLoading(true);
      dispatch({
        type: TODO_ACTIONS.FETCH_START 
      });
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
          // SUCCESS
          //setTodoList(data.tasks);
          //setFilterError('');
          dispatch({
            type: TODO_ACTIONS.FETCH_SUCCESS,
            payload: data.tasks
          });
        }
        else if(response.status === 401) {
          throw new Error('Unauthorized access.');
        }
        else {
          throw new Error('Cannot fetch todos');
        } 
      } catch(error) {
        /*if(debouncedFilterTerm || sortBy !== 'createdAt' || sortDirection !== 'desc') {
          setFilterError(`Error filtering/sorting todos: ${error.message}`);
        } else {
          setError(`Error fetching todos: ${error.message}`);
        }
        */
        dispatch({ 
          type: TODO_ACTIONS.FETCH_ERROR, 
          payload: { 
            message: `Error fetching todos: ${error.message}`, 
            debouncedFilterTerm 
          } 
        });
      } finally {
        setIsTodoListLoading(false); // Make new dispatch?
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
    //setIsTodoListLoading(true);
    //setTodoList(previous => [newTodo, ...previous]);
    dispatch({ type: TODO_ACTIONS.ADD_TODO_START, payload: newTodo });
    try {
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
        dispatch({ type: TODO_ACTIONS.ADD_TODO_SUCCESS, payload: newTodo, data: data });
        /*setTodoList(previous => previous.map((todo) => {
          if(todo.id === newTodo.id) {
            return data;
          } else {
            return todo;
          }
        }));
        */
        //invalidateCache();
      } else {
        throw new Error('Failed to add new todo');
      }
    } catch(error) {
      //setTodoList(previous => previous.filter((todo) => todo.id !== newTodo.id));
      //setError(error.message);
      dispatch({
        type: TODO_ACTIONS.ADD_TODO_ERROR,
        message: error.message,
        newTodo: newTodo
      });
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
    //setTodoList(updatedTodoList);
    dispatch({
      type: TODO_ACTIONS.COMPLETE_TODO_START,
      payload: updatedTodoList
    });
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
      //invalidateCache();
      dispatch({ 
        type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS
      });
    } catch(error) {
      /*setTodoList(previous => previous.map((todo) => {
          if(todo.id === originalTodo.id) {
            return {...originalTodo};
          } else {
            return todo;
          }
      }));
      setError(error.message);
    */
      dispatch({ 
        type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
        payload: {
          originalTodo,
          message: error.message,
        }
      });
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
    //setTodoList(updatedTodoList);
    dispatch({
      type: TODO_ACTIONS.UPDATE_TODO_START,
      payload: {
        updatedTodoList,
      }
    });
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
      //invalidateCache();
      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_SUCCESS
      });
    } catch (error) {
      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_ERROR,
        payload: {
          editedTodo,
          originalTodo, 
          message: error.message,
        }
      });
      /*setTodoList(previous => previous.map((todo) => {
          if(todo.id === editedTodo.id) {
            return {...originalTodo};
          } else {
            return todo;
          }
        }));
      setError(error.message);
      */
    } 
  }

  function handleFilterChange(filterTerm) {
    setFilterTerm(filterTerm);
  }

  const invalidateCache = useCallback(() => {
    console.log('Invalidating memo cache after todo mutation');
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
      {state.isTodoListLoading ? <p>Loading...</p> : null}
      <SortBy sortBy={sortBy} sortDirection={sortDirection} onSortByChange={setSortBy} onSortDirectionChange={setSortDirection}/>
      <FilterInput filterTerm={state.filterTerm} onFilterChange={handleFilterChange}></FilterInput>
			<TodoForm onAddTodo={addTodo}/>
			<TodoList todoList={state.todoList} dataVersion={state.dataVersion} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo}/>
      
    </>
  );
}

export default TodosPage;