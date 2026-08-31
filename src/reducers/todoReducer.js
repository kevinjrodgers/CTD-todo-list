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
    case TODO_ACTIONS.ADD_TODO_START: {
      const { newTodo } = action.payload;
      return {
        ...state,
        isTodoListLoading: true,
        todoList: previous => [newTodo, ...previous],
        //setTodoList(previous => [newTodo, ...previous]);
      }
    }
    case TODO_ACTIONS.ADD_TODO_SUCCESS: {
      const { newTodo, data } = action.payload;
      return {
        ...state,
        todoList: previous => previous.map((todo) => {
          if(todo.id === newTodo.id) {
            return data;
          } else {
            return todo;
          }
        }),
        dataVersion: previous => previous+1,
      }
    }
    case TODO_ACTIONS.ADD_TODO_ERROR: {
      const { message, newTodo } = action.payload;
      return {
        //setTodoList(previous => previous.filter((todo) => todo.id !== newTodo.id));
        //setError(error.message);
        ...state,
        todoList: previous => {previous.filter((todo) => todo.id !== newTodo.id)},
        error: message, 
      };
    }
    case TODO_ACTIONS.COMPLETE_TODO_START: {
      const { updatedTodoList } = action.payload;
      return {
        ...state,
        todoList: updatedTodoList,
      };
    }
    case TODO_ACTIONS.COMPLETE_TODO_SUCCESS: {
      return {
        ...state,
        dataVersion: previous => previous + 1
      };
    }
    case TODO_ACTIONS.COMPLETE_TODO_ERROR: {
      const { originalTodo, message } = action.payload;
      return {
        ...state,
        todoList: previous => previous.map((todo) => {
          if(todo.id === originalTodo.id) {
            return {...originalTodo};
          } else {
            return todo;
          }
        }),
        error: message,
      };
    }
    case TODO_ACTIONS.UPDATE_TODO_START: {
      const { updatedTodoList } = action.payload;
      return {
        ...state,
        todoList: updatedTodoList
      };
    }
    case TODO_ACTIONS.UPDATE_TODO_SUCCESS:
      return {
        ...state,
        dataVersion: previous => previous + 1
      };
    case TODO_ACTIONS.UPDATE_TODO_ERROR: {
      const { editedTodo, originalTodo, message } = action.payload;
      return {
        ...state,
        todoList: previous => previous.map((todo) => {
          if(todo.id === editedTodo.id) {
            return {...originalTodo};
          } else {
            return todo;
          }
        }),
        error: message,
      //setError(error.message);
      }
    }
    default: 
      throw new Error(`Unknown action type: ${action.type}`);
  }
}