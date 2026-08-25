import TodoListItem from './TodoListItem.jsx';
import { useMemo } from 'react';

function TodoList({ todoList, onCompleteTodo, onUpdateTodo, dataVersion }) {

	const filteredTodoList = useMemo(() => {
		let filterOutCompletedTodos = todoList.filter((todo) => todo.isCompleted !== true);
		return {
			version: dataVersion, 
			todos: filterOutCompletedTodos,
		};
	},[todoList, dataVersion]);

	return (
		<>
			{ filteredTodoList.todos.length === 0 ? <p>Add todo above to get started</p> : 
				<ul>
					{filteredTodoList.todos.map(todo => <TodoListItem key={todo.id} todo={todo} onCompleteTodo={onCompleteTodo} onUpdateTodo={onUpdateTodo}/>)}
				</ul>
			}
		</>
		
		
	);
	}

export default TodoList;