import { useRef, useState } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel.jsx';
import { isValidTodoTitle } from '../../utils/todoValidation.js';

function TodoForm({ onAddTodo }) {
  const inputRef = useRef();
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');

  const handleAddTodo = (event) => {
    event.preventDefault();
    onAddTodo(workingTodoTitle);
    setWorkingTodoTitle("");
    inputRef.current.focus();
  };

	return (
		<form onSubmit={handleAddTodo}>
      <TextInputWithLabel 
        ref={inputRef} 
        value={workingTodoTitle} 
        onChange={(e) => setWorkingTodoTitle(e.target.value)}
        elementId="todoTitle"
        labelText="Todo"
      />
			<button type="submit" disabled={!isValidTodoTitle(workingTodoTitle)}>
        Add Todo
      </button>
		</form>
	);
}

export default TodoForm;