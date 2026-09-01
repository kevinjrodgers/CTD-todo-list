export const TODO_ACTIONS = {
  // Fetch operations
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  
  // Add todo operations
  ADD_TODO_START: 'ADD_TODO_START',
  ADD_TODO_SUCCESS: 'ADD_TODO_SUCCESS',
  ADD_TODO_ERROR: 'ADD_TODO_ERROR',
  // ... continue for all operations
};

export const initialTodoState = {
  todoList: [],
  error: '',
  filterError: '',
  isTodoListLoading: false,
  sortBy: 'createdAt',
  sortDirection: 'desc',
  filterTerm: '',
  dataVersion: 0,
};

export function todoReducer(state, action) {
  console.log('Dispatched action:', action.type, action.payload);
  switch (action.type) {
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
      const { debouncedFilterTerm, message } = action.payload;
      if(debouncedFilterTerm || state.sortBy !== 'createdAt' || state.sortDirection !== 'desc') {
          //setFilterError(`Error filtering/sorting todos: ${error.message}`);
          return {
            ...state,
            filterError: `Error filtering/sorting todos: ${message}`,
            isTodoListLoading: false,
          };
      } else {
        //setError(`Error fetching todos: ${error.message}`);
        return {
          ...state,
          error: `Error fetching todos: ${message}`,
          isTodoListLoading: false,
        };
      }
    }
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};

