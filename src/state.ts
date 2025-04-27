import { State, Slice, Undoable } from 'scalux';
import { fetchTodosApi, addTodoApi } from './api';
import type { Todo, TodoDict, TodoListComponentDataProps } from './types';
import { TodoListComponentDisplay } from './TodoListComponent';

// ---- 1. State structure ----

// Business data slice (todos, input text) – wrapped in Undoable for history
const dataSlice = Slice(
  Undoable({
    todos: {} as TodoDict,
    newItemText: '',
  })
);

// UI slice (loading / error)
const uiSlice = Slice({
  loading: false,
  error: null as string | null,
});

// ---- 2. Initialize scalux ----
const { Component, register, Updater, Resolver, selectors, undo, redo } = State(
  {
    data: dataSlice,
    ui: uiSlice,
  }
);

// ---- 3. Updaters ----

/** Update the new‑item text field */
const setNewItemText = Updater((_s, txt: string) => ({
  data: { newItemText: txt },
}));

/** Toggle a todo */
const toggleTodo = Updater((state, id: string) => {
  const current = selectors.pick.data.todos(state)[id];
  if (!current) return {};
  return { data: { todos: { [id]: { ...current, done: !current.done } } } };
});

/** Fetch todos from the API */
const fetchTodos = Updater(async () => {
  try {
    const apiTodos = await fetchTodosApi();
    const dict = apiTodos.reduce((acc, t) => {
      acc[t.id] = { id: t.id, label: t.title, done: t.completed };
      return acc;
    }, {} as TodoDict);
    return { data: { todos: dict }, ui: { loading: false, error: null } };
  } catch (e: any) {
    return { ui: { loading: false, error: e.message || 'Unknown error' } };
  }
});

/** Add a new todo (resolve / updates pattern) */
const addTodo = Updater({
  resolve: Resolver(async (_s, label: string) => {
    if (!label.trim()) throw new Error('Label cannot be empty');
    const { id } = await addTodoApi(label);
    return { id, label, done: false } as Todo;
  }),
  updates: {
    data: (draft, todo) => {
      draft.todos[todo.id] = todo;
      draft.newItemText = '';
    },
  },
});

/** Delete a todo */
const deleteTodo = Updater({
  resolve: Resolver((_s, id: string) => id),
  updates: {
    data: (draft, id) => {
      delete draft.todos[id];
    },
  },
});

// ---- 4. Connect the React component ----
const selectTodoListData = Resolver((state): TodoListComponentDataProps => {
  const todosDict = selectors.pick.data.todos(state);
  const newItemText = selectors.pick.data.newItemText(state);
  const isLoading = selectors.pick.ui.loading(state);
  const error = selectors.pick.ui.error(state);
  const raw = selectors.rawGrab.data(state);
  const canUndo = raw.past.length > 0;
  const canRedo = raw.future.length > 0;
  return {
    todos: Object.values(todosDict),
    newItemText,
    isLoading,
    error,
    canUndo,
    canRedo,
  };
});

export const ConnectedTodoList = Component({
  domain: 'TodoList',
  render: TodoListComponentDisplay,
  data: selectTodoListData,
  handlers: {
    fetchTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
    setNewItemText,
    undoAction: undo,
    redoAction: redo,
  },
});

// ---- 5. Register reducers ----
const { reducer } = register();
export { reducer };
