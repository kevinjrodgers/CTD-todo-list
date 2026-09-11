/*
This component uses URL search parameters to manage todo status filters
Users can filter todos by all, active, or completed status
The filter state is stored in the URL, making it bookmarkable and shareable
*/

import { useSearchParams } from 'react-router';

function StatusFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentStatus = searchParams.get('status') || 'all';

  const handleStatusChange = (status) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (status === 'all') {
      // Remove status param for 'all' to keep URL clean
      newSearchParams.delete('status');
    } else {
      newSearchParams.set('status', status);
    }
    setSearchParams(newSearchParams);
  };

  return (
    <div>
      <label htmlFor='statusFilter'>Show:</label>
      <select
        id='statusFilter'
        value={currentStatus}
        onChange={(e) => handleStatusChange(e.target.value)}
      >
        <option value='all'>All Todos</option>
        <option value='active'>Active Todos</option>
        <option value='completed'>Completed Todos</option>
      </select>
    </div>
  );
}

export default StatusFilter;