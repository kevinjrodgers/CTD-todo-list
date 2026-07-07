import './App.css';

function App() {
  const todoList = [
    {id: 1, title: "Review resources"},
    {id: 2, title: "Take notes"},
    {id: 3, title: "Code out application"},
  ];
  return (
    <div>
      <h1>My Todos</h1>
      <ul>
        {todoList.map((todo) => 
          <li key={todo.id}>{todo.title}</li>
        )}
      </ul>
    </div>
  )
}

export default App
