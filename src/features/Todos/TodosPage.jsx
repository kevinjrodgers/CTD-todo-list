import { useEffect, useCallback, useReducer } from 'react';
import TodoForm from './TodoForm.jsx';
import TodoList from './TodoList/TodoList.jsx';
import SortBy from '../../shared/SortBy.jsx';
import useDebounce from '../../utils/useDebounce.js';
import FilterInput from '../../shared/FilterInput.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { 
  todoReducer,
  initialTodoState,
  TODO_ACTIONS,
} from '../../reducers/todoReducer.js';

function TodosPage() {
  
  const [state, dispatch] = useReducer(todoReducer, initialTodoState);
  const { token } = useAuth();

  const {
    todoList,
    error,
    filterError,
    isTodoListLoading,
    sortBy,
    sortDirection,
    filterTerm,
    dataVersion,
  } = state;
  
  const debouncedFilterTerm = useDebounce(filterTerm, 300);

  useEffect(() => {
    const fetchTodos = async() => {
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
          dispatch({
            type: TODO_ACTIONS.FETCH_SUCCESS,
            payload: { todos: data.tasks },
          });
        }
        else if(response.status === 401) {
          throw new Error('Unauthorized access.');
        }
        else {
          throw new Error('Cannot fetch todos');
        } 
      } catch(error) {
        dispatch({
          type: TODO_ACTIONS.FETCH_ERROR,
          payload: {
            debouncedFilterTerm: debouncedFilterTerm,
            message: error.message
          }
        });
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
    dispatch({
      type: TODO_ACTIONS.ADD_TODO_START,
      payload: {
        newTodo: newTodo,
      }
    });
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
        dispatch({
          type: TODO_ACTIONS.ADD_TODO_SUCCESS,
          payload: {
            newTodo,
            data,
          }
        });
        invalidateCache();
      } else {
        throw new Error('Failed to add new todo');
      }
    } catch(error) {
      dispatch({
        type: TODO_ACTIONS.ADD_TODO_ERROR,
        payload: {
          newTodo,
          message: error.message,
        },
      });
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
    dispatch({
      type: TODO_ACTIONS.COMPLETE_TODO_START,
      payload: {
        updatedTodoList,
      }
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
      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS,
      });
      invalidateCache();
    } catch(error) {
     dispatch({
      type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
      payload: {
        originalTodo,
        message: error.message,
      },
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
    console.log(`Updatedtodolist: ${updatedTodoList}`);
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
      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_SUCCESS,
      });
      invalidateCache();
    } catch (error) {
      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_ERROR,
        payload: {
          originalTodo,
          editedTodo,
          message: error.message,
        }
      });
    } 
  }

  function handleFilterChange(filterTerm) {
    dispatch({
      type: TODO_ACTIONS.SET_FILTER,
      payload: {
        filterTerm,
      }
    });
  }

  const invalidateCache = useCallback(() => {
    console.log('Invalidating memo cache after todo mutation');
    dispatch({
      type: TODO_ACTIONS.SET_DATA_VERSION,
    });
  }, []);

  return (
    <>
      {error ? 
      <section>
          <p>{error}</p> 
          <button 
            onClick={() =>
              dispatch({
                type: TODO_ACTIONS.CLEAR_ERROR,
              })
            }
          >
            Clear Error
          </button>
      </section> 
      : null}
      {filterError ? 
        <div>
          <p>{filterError}</p>
          <button 
            type='button'
            onClick={ () =>
              dispatch({
                type: TODO_ACTIONS.CLEAR_FILTER,
              })
            }  
          >
              Clear Filter Error
          </button>
          <button 
            type='button'
            onClick={() => {
              dispatch({
                type: TODO_ACTIONS.RESET_FILTERS,
              });
            }}
          >
           Reset Filters
          </button>
        </div> 
        : <></>}
      {isTodoListLoading ? <p>Loading...</p> : null}
      <SortBy 
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortByChange={(newSortBy) => 
          dispatch({
            type: TODO_ACTIONS.SET_SORT,
            payload: {
              sortBy: newSortBy,
              sortDirection,
            }
          })
        }
        onSortDirectionChange={(newSortDirection) => 
          dispatch({
            type: TODO_ACTIONS.SET_SORT,
            payload: {
              sortBy,
              sortDirection: newSortDirection,
            }
          })
        }
      />
      <FilterInput filterTerm={filterTerm} onFilterChange={handleFilterChange}></FilterInput>
			<TodoForm onAddTodo={addTodo}/>
			<TodoList todoList={todoList} dataVersion={dataVersion} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo}/>
    </>
  );
}

export default TodosPage;