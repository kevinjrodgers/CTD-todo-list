// A helper function that validates logic in input fields

export function isValidTodoTitle(title) {
    // Returns true if the title is not empty after removing whitespace
    return title.trim() !== '';
}