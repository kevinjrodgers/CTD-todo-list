function SortBy({ sortBy, sortDirection, onSortByChange, onSortDirectionChange }) {
  return (
    <>
      <label htmlFor="sortBy">Sort by</label>
      <select name='sortBy' id='sortBy' value={sortBy} onChange={(e) => onSortByChange(e.target.value)}>
        <option value='createdAt'>Created At</option>
        <option value='title'>Title</option>
      </select>
      <label htmlFor='order'>Order</label>
      <select name='order' id='order' value={sortDirection} onChange={(e) => onSortDirectionChange(e.target.value)}>
        <option value='desc'>Descending</option>
        <option value='asc'>Ascending</option>
      </select>
    </>
  );
  
}

export default SortBy;