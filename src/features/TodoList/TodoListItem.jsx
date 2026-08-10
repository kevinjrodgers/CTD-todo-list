import { useState } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel.jsx";
import {isValidTodoTitle} from "../../utils/todoValidation.js";

function TodoListItem({todo, onCompleteTodo, onUpdateTodo}) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(todo.title);

  function handleCancel() {
    setWorkingTitle(todo.title);
    setIsEditing(false);
  }

  function handleEdit(event) {
    setWorkingTitle(event.target.value);
  }

  function handleUpdate(event) {
    if(isEditing === false) {
      return;
    }
    event.preventDefault();
    let newTodoObject = {...todo};
    newTodoObject.title = workingTitle;
    onUpdateTodo(newTodoObject);
    setIsEditing(false);
  }

	return (
		<li>
      {isEditing ? (
        <>
          <TextInputWithLabel value={workingTitle} onChange={(event) => handleEdit(event)}/>
          <button type="button" onClick={handleCancel}>Cancel</button>
          <button type="button" onClick={(event) => handleUpdate(event)} disabled={!isValidTodoTitle(workingTitle)}>Update</button>
        </>
       ) : (
              <>
                <label>
                  <input
                    type="checkbox"
                    id={`checkbox${todo.id}`}
                    checked={todo.isCompleted}
                    onChange={() => onCompleteTodo(todo.id)}
                  />
                </label> 
                <span onClick={() => setIsEditing(true)}>{todo.title}</span>
              </>
            )}
			
    </li>
	);
}

export default TodoListItem;