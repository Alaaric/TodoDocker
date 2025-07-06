import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTodoService } from '../../../src/hooks/useTodoService';
import TodoServiceContext from '../../../src/context/TodoServiceContext';

describe('useTodoService Hook', () => {
  it('devrait retourner le contexte du service Todo', () => {
    const mockTodoService = {
      getAllTodos: vi.fn(),
      getTodoById: vi.fn(),
      createTodo: vi.fn(),
      updateTodo: vi.fn(),
      deleteTodo: vi.fn(),
      toggleTodoCompletion: vi.fn()
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TodoServiceContext.Provider value={mockTodoService}>
        {children}
      </TodoServiceContext.Provider>
    );

    const { result } = renderHook(() => useTodoService(), { wrapper });
    
    expect(result.current).toBe(mockTodoService);
  });
});
