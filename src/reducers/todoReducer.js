export const TODO_ACTIONS = {
  // Fetch operations
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  
  // Add todo operations
  ADD_TODO_START: 'ADD_TODO_START',
  ADD_TODO_SUCCESS: 'ADD_TODO_SUCCESS',
  ADD_TODO_ERROR: 'ADD_TODO_ERROR',
  
  // Complete todo operations
  COMPLETE_TODO_START: 'COMPLETE_TODO_START',
  COMPLETE_TODO_SUCCESS: 'COMPLETE_TODO_SUCCESS',
  COMPLETE_TODO_ERROR: 'COMPLETE_TODO_ERROR',

  // Update todo operations
  UPDATE_TODO_START: 'UPDATE_TODO_START',
  UPDATE_TODO_SUCCESS: 'UPDATE_TODO_SUCCESS',
  UPDATE_TODO_ERROR: 'UPDATE_TODO_ERROR',

  // Event handlers/setters
  SET_SORT: 'SET_SORT',
  SET_FILTER: 'SET_FILTER',
  SET_DATA_VERSION: 'SET_DATA_VERSION',

  // Error clearing
  CLEAR_ERROR: 'CLEAR_ERROR',
  CLEAR_FILTER_ERROR: 'CLEAR_FILTER_ERROR',

  // Reset
  RESET_FILTERS: 'RESET_FILTERS',
};

export const initialTodoState = {
  todoList: [],
  error: '',
  filterError: '',
  isTodoListLoading: true,
  sortBy: 'createdAt',
  sortDirection: 'asc',
  filterTerm: '',
  dataVersion: 0,
};

export function todoReducer(state, action) {
  console.log('Dispatched action:', action.type, action.payload);
  switch (action.type) {
    // FETCH
    case TODO_ACTIONS.FETCH_START:
      return {
        ...state,
        isTodoListLoading: true,
        error: '',
        filterError: '',
      };
    case TODO_ACTIONS.FETCH_SUCCESS: {
      const { todos } = action.payload;
      return {
        ...state,
        todoList: todos,
        filterError: '',
        isTodoListLoading: false,
      };
    }
    case TODO_ACTIONS.FETCH_ERROR: {
      const { message, isFilterError } = action.payload;
      if(isFilterError === true) {
          return {
            ...state,
            filterError: message,
            isTodoListLoading: false,
          };
      } else {
        return {
          ...state,
          error: `Error fetching todos: ${message}`,
          isTodoListLoading: false,
        };
      }
    }
    // ADD
    case TODO_ACTIONS.ADD_TODO_START: {
      const { newTodo } = action.payload;
      return {
        ...state,
        isTodoListLoading: true,
        todoList: [newTodo, ...state.todoList],
      };
        //setIsTodoListLoading(true);
        //setTodoList(previous => [newTodo, ...previous]);
    }
    case TODO_ACTIONS.ADD_TODO_SUCCESS: {
      const { newTodo, data } = action.payload;
      return {
        ...state,
        todoList: state.todoList.map((todo) => {
          if(todo.id === newTodo.id) {
            return data;
          } else {
            return todo;
          }
        }),
        isTodoListLoading: false,
      };
    }
    case TODO_ACTIONS.ADD_TODO_ERROR: {
      const { newTodo, message } = action.payload;
      return {
        ...state,
        todoList: state.todoList.filter((todo) => todo.id !== newTodo.id),
        error: message,
        isTodoListLoading: false,
        //setTodoList(previous => previous.filter((todo) => todo.id !== newTodo.id));
        //setError(error.message);
        //setIsTodoListLoading(false);
      };
    }
    // COMPLETE TODOS
    case TODO_ACTIONS.COMPLETE_TODO_START: {
      const { updatedTodoList } = action.payload;
      return {
        ...state,
        todoList: updatedTodoList,
        isTodoListLoading: true,
      };
    }
    case TODO_ACTIONS.COMPLETE_TODO_SUCCESS: {
      return {
        ...state,
        isTodoListLoading: false,
      };
    }
    case TODO_ACTIONS.COMPLETE_TODO_ERROR: {
      const { originalTodo, message } = action.payload;
      return {
        ...state,
        todoList: state.todoList.map((todo) => {
          if(todo.id === originalTodo.id) {
            return {...originalTodo};
          } else {
            return todo;
          }
        }),
        error: message,
        isTodoListLoading: false,
      }
    }
    // UPDATE TODOS
    case TODO_ACTIONS.UPDATE_TODO_START: {
      const { updatedTodoList } = action.payload;
      return {
        ...state,
        todoList: updatedTodoList,
        isTodoListLoading: true,
      };
    }
    case TODO_ACTIONS.UPDATE_TODO_SUCCESS: {
      return {
        ...state,
        isTodoListLoading: false,
      };
    }
    case TODO_ACTIONS.UPDATE_TODO_ERROR: {
      const { originalTodo, editedTodo, message } = action.payload;
      return {
        ...state,
        todoList: state.todoList.map((todo) => {
          if(todo.id === editedTodo.id) {
            return {...originalTodo};
          } else {
            return todo;
          }
        }),
        error: message,
        isTodoListLoading: false,
      };
    }
    // EVENT HANDLERS/SETTERS
    case TODO_ACTIONS.SET_SORT: {
      const { sortBy, sortDirection } = action.payload;
      return {
        ...state,
        sortBy: sortBy,
        sortDirection: sortDirection,
      };
    }
    case TODO_ACTIONS.SET_FILTER: {
      const { filterTerm } = action.payload;
      return {
        ...state,
        filterTerm: filterTerm,
      };
    }
    case TODO_ACTIONS.SET_DATA_VERSION: {
      return {
        ...state,
        dataVersion: state.dataVersion + 1,
      };
    }
    // CLEAR ERRORS
    case TODO_ACTIONS.CLEAR_ERROR: {
      return {
        ...state,
        error: '',
      };
    }
    case TODO_ACTIONS.CLEAR_FILTER_ERROR: {
      return {
        ...state,
        filterError: '',
      };
    }
    // RESET FILTERS
    case TODO_ACTIONS.RESET_FILTERS: {
      return {
        ...state,
        filterTerm: '',
        filterError: '',
        sortBy: 'createdAt',
        sortDirection: 'asc',
      };
    }
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};

