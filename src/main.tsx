// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'scalux'; // React‑Redux provider
import { store } from './store';
import { ConnectedTodoList } from './state';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ConnectedTodoList />
    </Provider>
  </React.StrictMode>
);
