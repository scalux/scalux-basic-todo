// src/TodoListComponent.tsx
import React, { useEffect } from 'react';
import type { TodoListComponentProps } from './types';

/** Pure React component that displays the Todo list */
export const TodoListComponentDisplay: React.FC<TodoListComponentProps> = ({
  // Data props
  todos,
  newItemText,
  isLoading,
  error,
  canUndo,
  canRedo,
  // Handler props
  fetchTodos,
  addTodo,
  toggleTodo,
  deleteTodo,
  setNewItemText,
  undoAction,
  redoAction,
}) => {
  // Load todos on first mount
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  /** Handle form submission */
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemText.trim()) {
      addTodo(newItemText.trim());
    }
  };

  return (
    <div style={{ padding: '0 2.5em' }}>
      <h1>My Scalux Todo List</h1>

      {/* Undo / Redo buttons */}
      <div>
        <button onClick={undoAction} disabled={!canUndo || isLoading}>
          Undo
        </button>
        <button onClick={redoAction} disabled={!canRedo || isLoading}>
          Redo
        </button>
      </div>

      {/* Add form */}
      <form onSubmit={handleAdd} style={{ margin: '1em 0' }}>
        <input
          type="text"
          placeholder="New task …"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          disabled={isLoading}
          aria-label="New task"
        />
        <button type="submit" disabled={isLoading || !newItemText.trim()}>
          Add
        </button>
      </form>

      {/* Loading indicator */}
      {isLoading && <p>Loading todos …</p>}

      {/* Error */}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {/* Todo list */}
      {!isLoading && !error && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {todos.map((todo) => (
            <li
              key={todo.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                margin: '0.5em 0',
                textDecoration: todo.done ? 'line-through' : 'none',
                opacity: todo.done ? 0.6 : 1,
              }}
            >
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
                style={{ marginRight: '0.5em' }}
              />
              <span style={{ flexGrow: 1 }}>{todo.label}</span>
              <button
                onClick={() => deleteTodo(todo.id)}
                style={{ marginLeft: '0.5em' }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Empty state */}
      {!isLoading && !error && todos.length === 0 && <p>No tasks yet!</p>}
    </div>
  );
};
