// Validates todo input field
import { z } from 'zod';
import DOMPurify from 'dompurify';
import { MAX_TODO_LENGTH } from '../constants/config';
/*export function isValidTodoTitle(title) {
    return title.trim() !== '';
}
    */

const todoSchema = z.string()
  .min(3, 'Todo must be at least 3 characters long')
  .max(MAX_TODO_LENGTH, 'Todo must be less than 50 characters')
  .refine((value) => value.trim().length > 0, 'Todo cannot be empty');

export function isValidTodoTitle(title) {
  try {
    const validatedTitleInput = todoSchema.parse(title);
    const sanitizedTodo = DOMPurify.sanitize(validatedTitleInput);
    return {
      title: sanitizedTodo,
      isValid: true,
    };
  } catch(error) {
    return {
      message: error.issues[0].message,
      isValid: false,
    }
  }
}