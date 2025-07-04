import React, { createContext, ReactNode } from 'react';
import { TodoManagement } from '../services/todoServiceInterface';
import { todoService } from '../services/todoService';

const TodoServiceContext = createContext<TodoManagement>(todoService);

interface TodoServiceProviderProps {
  service: TodoManagement;
  children: ReactNode;
}

export const TodoServiceProvider: React.FC<TodoServiceProviderProps> = ({ service, children }) => {
  return (
    <TodoServiceContext.Provider value={service}>
      {children}
    </TodoServiceContext.Provider>
  );
};

export default TodoServiceContext;
