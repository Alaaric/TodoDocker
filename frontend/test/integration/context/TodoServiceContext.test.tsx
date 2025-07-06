import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TodoServiceProvider } from '../../../src/context/TodoServiceContext';
import { useTodoService } from '../../../src/hooks/useTodoService';

const TestComponent = () => {
  const todoService = useTodoService();
  return (
    <div>
      <span data-testid="service-check">
        {typeof todoService.getAllTodos === 'function' ? 'TodoService Disponible' : 'TodoService Indisponible'}
      </span>
    </div>
  );
};

describe('TodoServiceContext et Provider', () => {
  it('devrait fournir le TodoService aux composants enfants', () => {
    const mockTodoService = {
      getAllTodos: vi.fn(),
      getTodoById: vi.fn(),
      createTodo: vi.fn(),
      updateTodo: vi.fn(),
      deleteTodo: vi.fn(),
      toggleTodoCompletion: vi.fn()
    };

    render(
      <TodoServiceProvider service={mockTodoService}>
        <TestComponent />
      </TodoServiceProvider>
    );

    expect(screen.getByTestId('service-check')).toHaveTextContent('TodoService Disponible');
  });
});
