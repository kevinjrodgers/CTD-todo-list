function SortBy({ sortBy, sortDirection, onSortByChange, onSortDirectionChange }) {
  return (
    <>
      <label htmlFor="sortBy">Sort by</label>
      <select name='sortBy' id='sortBy' value={sortBy}>
        <option value='createdAt' onChange={(e) => onSortByChange(e.target.value)}>Created At</option>
        <option value='title' onChange={(e) => onSortByChange(e.target.value)}>Title</option>
      </select>
      <label htmlFor='order'>Order</label>
      <select name='order' id='order' value={sortDirection}>
        <option value='desc' onChange={(e) => onSortDirectionChange(e.target.value)}>Descending</option>
        <option value='asc' onChange={(e) => onSortDirectionChange(e.target.value)}>Ascending</option>
      </select>
    </>
  );
  
}

export default SortBy;