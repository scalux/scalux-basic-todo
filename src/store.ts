// src/store.ts
import { configureStore } from 'scalux';
import { reducer } from './state';

export const store = configureStore({ reducer });
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
