
function TextInputWithLabel({
  elementId,
  labelText,
  onChange,
  ref,
  value,
}) {
  return (
    <>
      <label htmlFor={elementId}>{labelText}</label>
      <input 
        type="text"
        id={elementId}
        name={elementId} // Not sure if needed
        ref={ref}
        value={value}
        onChange={onChange}
      />
    </>
  );
}

export default TextInputWithLabel;