// src/api.ts

// Shape returned by the API (may differ from our internal state)
export type ApiTodo = {
  id: string;
  title: string;
  completed: boolean;
};

/** Simulate an API request that fetches initial todos */
export const fetchTodosApi = async (): Promise<ApiTodo[]> => {
  console.log('API: Fetching todos …');
  await new Promise((r) => setTimeout(r, 800)); // Simulated latency

  if (Math.random() > 0.15) {
    // 85 % success – otherwise throw
    console.log('API: Fetch successful');
    const todos: ApiTodo[] = [
      { id: '1', title: 'Learn scalux', completed: true },
      { id: '2', title: 'Use Updater with resolve/reducers', completed: false },
      { id: '3', title: 'Implement undo/redo', completed: false },
      { id: '4', title: 'Drink a coffee', completed: true },
      { id: '5', title: 'Test deletion', completed: false },
    ];
    return todos;
  }
  console.error('API: Fetch failed');
  throw new Error('Simulated network error while fetching todos.');
};

/** Simulate server‑side todo creation */
export const addTodoApi = async (label: string): Promise<{ id: string }> => {
  console.log(`API: Adding todo \"${label}\" …`);
  await new Promise((r) => setTimeout(r, 300));
  const newId = `temp_${Date.now()}`;
  console.log(`API: Todo added with temp ID ${newId}`);
  return { id: newId };
};
