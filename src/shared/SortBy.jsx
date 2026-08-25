function SortBy({ sortBy, sortDirection, onSortByChange, onSortDirectionChange }) {
  return (
    <>
      <label htmlFor="sortBy">Sort By</label>
      <select name='sortBy' id='sortBy'>
        <option value='createdAt' onClick={(e) => onSortByChange(e.target.value)}>Created At</option>
        <option value='title' onClick={(e) => onSortByChange(e.target.value)}>Title</option>
      </select>
      <label htmlFor='order'>Order</label>
      <select name='order' id='order'>
        <option value='desc' onClick={(e) => onSortDirectionChange(e.target.value)}>Descending</option>
        <option value='asc' onClick={(e) => onSortDirectionChange(e.target.value)}>Ascending</option>
      </select>
    </>
  );
  
}

export default SortBy;