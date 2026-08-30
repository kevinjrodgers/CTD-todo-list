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

  // Update todo operation
  UPDATE_TODO_START: 'UPDATE_TODO_START',
  UPDATE_TODO_SUCCESS: 'UPDATE_TODO_SUCCESS',
  UPDATE_TODO_ERROR: 'UPDATE_TODO_ERROR',

};

export const initialState = {
  todoList: [],
  error: '',
  filterError: '',
  isTodoListLoading: false, // Instructions show this as an initial value of true?
  sortBy: 'createdAt',
  sortDirection: 'desc', // Instructions show this as an initial value of asc?
  filterTerm: '',
  dataVersion: 0,
};

export function todoReducer(state, action) {
  switch(action.type) {
    // Add more cases here
    case TODO_ACTIONS.FETCH_START:
      return {
        ...state,
        isTodoListLoading: true,
        error: '',
        filterError: '',
      };
    case TODO_ACTIONS.FETCH_SUCCESS:
      return {
        ...state,
        todoList: action.payload,
        filterError: '',
      };
    case TODO_ACTIONS.FETCH_ERROR: {
      const { debouncedFilterTerm, message } = action.payload;
      if(debouncedFilterTerm || state.sortBy !== 'createdAt' || state.sortDirection !== 'desc') {
        return {
          ...state,
          filterError: message,
        }
      } else {
        return {
          ...state,
          error: message,
        }
      }
    }
    default: 
      throw new Error(`Unknown action type: ${action.type}`);
  }
}