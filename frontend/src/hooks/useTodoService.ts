import { useContext } from 'react';
import TodoServiceContext from '../context/TodoServiceContext';
import { TodoManagement } from '../services/todoServiceInterface';

export const useTodoService = (): TodoManagement => {
  return useContext(TodoServiceContext);
};
