function TodoList() {

    const todoList = [
        {id: 1, title: "Review resources"},
        {id: 2, title: "Take notes"},
        {id: 3, title: "Code out application"},
    ];

    return (
        <ul>
            {todoList.map((todo) => 
            <li key={todo.id}>{todo.title}</li>
            )}
        </ul>
    );
}

export default TodoList;