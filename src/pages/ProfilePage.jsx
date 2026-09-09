import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

function ProfilePage() {
  const { email, token } = useAuth();
  const [todoStats, setTodoStats] = useState({
    total: 0,
    completed: 0,
    active: 0,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchTodoStats() {
      if(!token) return;

      try {
        setIsLoading(true);
        setError('');

        const options = {
          method: 'GET',
          headers: {
            'X-CSRF-TOKEN': token,
          },
          credentials: 'include',
        };

        const paramsObject  = {
          limit: 100,
        }

        const params = new URLSearchParams(paramsObject);
        const response = await fetch(`/api/tasks?${params}`, options);
        if(response.status === 401) {
          throw new Error('Unauthorized');
        }
        if(!response.ok) {
          throw new Error('Failed to fetch todos');
        }
        const data = await response.json();
        // Calculate statistics
        const total = data.tasks.length;
        const completed = data.tasks.filter((todo) => todo.isCompleted).length;
        const active = total - completed;
        setTodoStats({ total, completed, active });
      } catch (error) {
        setError(`Error loading statistics: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTodoStats();
  }, [token]);

  // PUT IN API statistics
  return (
    <main>
      <h1>Hello, {email}. </h1>
      {error ? <p>{error}</p> : <></>}
      {isLoading ? <p>Loading profile and statistics...</p> : 
        (
          <div>
            <h3>Statistics</h3>
            <div>
              <h5>Total Todos</h5>
              <p>{todoStats.total}</p>
            </div>
            <div>
              <h5>Completed Todos</h5>
              <p>{todoStats.completed}</p>
            </div>
            <div>
              <h5>Active Todos</h5>
              <p>{todoStats.active}</p>
            </div>
            <div>
              <h5>Todo Completion Percentage</h5>
              <p>{Math.round((todoStats.completed / todoStats.total) * 100)}%</p>
            </div>
        </div>
        )
      }
    </main>
  );
}

export default ProfilePage;