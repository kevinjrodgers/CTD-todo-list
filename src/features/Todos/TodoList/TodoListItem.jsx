import { useState } from 'react';
import TextInputWithLabel from '../../../shared/TextInputWithLabel.jsx';
import { isValidTodoTitle } from '../../../utils/todoValidation.js';
import styles from '../../../styles/TodoListItem.module.css';

function TodoListItem({todo, onCompleteTodo, onUpdateTodo, onDeleteTodo}) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(todo.title);
  const [updateTitleError, setUpdateTitleError] = useState([]);

  function handleCancel() {
    setWorkingTitle(todo.title);
    setIsEditing(false);
  }

  function handleEdit(event) {
    setWorkingTitle(event.target.value);
  }

  function handleUpdate(event) {
    setUpdateTitleError([]);
    if(isEditing === false) {
      return;
    }
    event.preventDefault();
    try {
      const isValidTitle = isValidTodoTitle(workingTitle);
      if(isValidTitle.isValid !== true) {
        throw new Error(isValidTitle.message);
      }
      onUpdateTodo({ ...todo, title: workingTitle });
    } catch(error) {
      setUpdateTitleError(error.message);
    }
    setIsEditing(false);
  }

  function handleDelete(event) {
    event.preventDefault();
    onDeleteTodo(todo.id);
    setIsEditing(false);
  }

	return (
		<li>
      <form onSubmit={handleUpdate}>
        {updateTitleError.length > 0 ? <p className='errorText errorTextRed'>{updateTitleError}</p> : <></>}
        {isEditing ? (
        <>
          <TextInputWithLabel value={workingTitle} onChange={(event) => handleEdit(event)} elementId={`input${todo.id}`} labelText={''}/>
          <button type='button' onClick={handleCancel}>Cancel</button>
          <button className={styles.todoListItemUpdateButton} type='button' onClick={handleUpdate}>Update</button>
          <button className={styles.todoListItemDeleteButton} type='button' onClick={handleDelete}>Delete</button>
        </>
       ) : (
              <>
                <label>
                  <input
                    type='checkbox'
                    className={styles.checkBox}
                    id={`checkbox${todo.id}`}
                    checked={todo.isCompleted}
                    onChange={() => onCompleteTodo(todo.id)}
                  />
                </label> 
                <span onClick={() => setIsEditing(true)}>{todo.title}</span>
              </>
            )}
      </form>
    </li>
	);
}

export default TodoListItem;