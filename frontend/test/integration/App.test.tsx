import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...(actual as Record<string, unknown>),
    BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Routes: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Route: ({ element }: { element: React.ReactNode }) => <div>{element}</div>,
  };
});

vi.mock('../../src/pages/TodoListPage', () => ({
  default: () => <div data-testid="todo-list-page">TodoListPage Mock</div>
}));

vi.mock('../../src/pages/TodoFormPage', () => ({
  default: () => <div data-testid="todo-form-page">TodoFormPage Mock</div>
}));

vi.mock('../../src/components/ThemeToggle', () => ({
  default: () => <div data-testid="theme-toggle">ThemeToggle Mock</div>
}));

vi.mock('../../src/services/todoService', () => ({
  todoService: {
    getAllTodos: vi.fn(),
    getTodoById: vi.fn(),
    createTodo: vi.fn(),
    updateTodo: vi.fn(),
    deleteTodo: vi.fn(),
    toggleTodoCompletion: vi.fn()
  }
}));

import App from '../../src/App';

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait avoir les routes correctes et le ThemeToggle', () => {
    render(<App />);
    
    expect(screen.getByTestId('todo-list-page')).toBeInTheDocument();
    expect(screen.getAllByTestId('todo-form-page').length).toBeGreaterThan(0);
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
  });
});
