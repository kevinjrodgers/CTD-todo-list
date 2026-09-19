import { useRef, useState } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel.jsx';
import { isValidTodoTitle } from '../../utils/todoValidation.js';

function TodoForm({ onAddTodo }) {
  const inputRef = useRef();
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');
  const [validTodoTitleErrors, setValidTodoTitleErrors] = useState([]);

  const handleAddTodo = (event) => {
    event.preventDefault();
    setValidTodoTitleErrors([]);
    try {
      const isTitleValid = isValidTodoTitle(workingTodoTitle);
      if(isTitleValid.isValid !== true) {
        throw new Error(isTitleValid.message);
      }
      setWorkingTodoTitle(isTitleValid.title);
      onAddTodo(workingTodoTitle);
      setWorkingTodoTitle('');
      inputRef.current.focus();
    } catch(error) {
      setValidTodoTitleErrors(error.message);
    }

  };

	return (
    <>
      {validTodoTitleErrors.length > 0 ? <p>* {validTodoTitleErrors}</p> : <></>}
      <form onSubmit={handleAddTodo}>
        <TextInputWithLabel 
          ref={inputRef} 
          value={workingTodoTitle} 
          onChange={(e) => setWorkingTodoTitle(e.target.value)}
          elementId='todoTitle'
          labelText='Create a Todo'
        />
        <button type='submit'>
          Add Todo
        </button>
      </form>
    </>
	);
}

export default TodoForm;