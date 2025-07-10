import { vi } from 'vitest';
import { Todo, TodoInput, TodoManagement } from '../../src/services/todoServiceInterface';

export const mockTodos: Todo[] = [
  { id: 1, title: 'Tâche de test 1', completed: false },
  { id: 2, title: 'Tâche de test 2', completed: true },
  { id: 3, title: 'Tâche de test 3', completed: false }
];

export const mockTodoService: TodoManagement = {
  getAllTodos: vi.fn().mockResolvedValue(mockTodos),
  
  getTodoById: vi.fn().mockImplementation((id: number | string) => {
    const todo = mockTodos.find(t => t.id === Number(id));
    if (todo) {
      return Promise.resolve(todo);
    }
    return Promise.reject(new Error(`Todo with id ${id} not found`));
  }),
  
  createTodo: vi.fn().mockImplementation((todoData: TodoInput) => {
    const newTodo = { id: Math.floor(Math.random() * 1000) + 10, ...todoData };
    return Promise.resolve(newTodo);
  }),
  
  updateTodo: vi.fn().mockImplementation((id: number | string, todoData: Partial<TodoInput>) => {
    const todoIndex = mockTodos.findIndex(t => t.id === Number(id));
    if (todoIndex === -1) {
      return Promise.reject(new Error(`Todo with id ${id} not found`));
    }
    
    const updatedTodo = { ...mockTodos[todoIndex], ...todoData };
    return Promise.resolve(updatedTodo);
  }),
  
  deleteTodo: vi.fn().mockResolvedValue(undefined),
  
  toggleTodoCompletion: vi.fn().mockImplementation((id: number | string, completed: boolean) => {
    const todoIndex = mockTodos.findIndex(t => t.id === Number(id));
    if (todoIndex === -1) {
      return Promise.reject(new Error(`Todo with id ${id} not found`));
    }
    
    const updatedTodo = { ...mockTodos[todoIndex], completed };
    return Promise.resolve(updatedTodo);
  })
};
