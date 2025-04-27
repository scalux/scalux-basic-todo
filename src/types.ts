/** Base type for a Todo item */
export type Todo = {
  id: string;
  label: string;
  done: boolean;
};

/** Dictionary form { id → Todo } */
export type TodoDict = Record<string, Todo>;

// ---- Props for the React component ----

/** Props that carry data to display */
export type TodoListComponentDataProps = {
  todos: Todo[]; // Todos as an array for rendering
  newItemText: string; // Text in the add‑item field
  isLoading: boolean; // API loading flag
  error: string | null; // API error message
  canUndo: boolean; // true if an undo is possible
  canRedo: boolean; // true if a redo is possible
};

/** Props that expose handlers the UI can call */
export type TodoListComponentHandlerProps = {
  fetchTodos: () => void;
  addTodo: (label: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  setNewItemText: (text: string) => void;
  undoAction: () => void;
  redoAction: () => void;
};

/** Full prop set for the TodoListComponent */
export type TodoListComponentProps = TodoListComponentDataProps &
  TodoListComponentHandlerProps;
