import { useState } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel.jsx";

function TodoListItem({todo, onCompleteTodo}) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(todo.title);

  function handleCancel() {
    setWorkingTitle(todo.title);
    setIsEditing(false);
  }

  function handleEdit(event) {
    setWorkingTitle(event.target.value);
  }

	return (
		<li>
      {isEditing ? (
        <TextInputWithLabel value={workingTitle} onChange={(event) => handleEdit(event)}/>
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
			<button type="button" onClick={handleCancel}>Cancel</button>
    </li>
	);
}

export default TodoListItem;