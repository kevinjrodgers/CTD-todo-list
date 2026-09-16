
import { MAX_TODO_LENGTH } from "../constants/config";

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
        type='text'
        id={elementId}
        ref={ref}
        value={value}
        onChange={onChange}
        maxLength={MAX_TODO_LENGTH}
      />
    </>
  );
}

export default TextInputWithLabel;