import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TodoListPage from '../../src/pages/TodoListPage';
import { TodoServiceProvider } from '../../src/context/TodoServiceContext';
import { mockTodos } from '../mocks/mockTodoService';

const mockGetAllTodos = vi.fn();
const mockDeleteTodo = vi.fn();
const mockToggleTodoCompletion = vi.fn();

const mockTodoService = {
  getAllTodos: mockGetAllTodos,
  getTodoById: vi.fn(),
  createTodo: vi.fn(),
  updateTodo: vi.fn(),
  deleteTodo: mockDeleteTodo,
  toggleTodoCompletion: mockToggleTodoCompletion
};

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <TodoServiceProvider service={mockTodoService}>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </TodoServiceProvider>
  );
};

describe('TodoListPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    
    mockTodoService.getAllTodos.mockResolvedValue(mockTodos);
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('devrait afficher le titre de la page', () => {
    renderWithProviders(<TodoListPage />);
    expect(screen.getByText(/TODO LIST/i)).toBeInTheDocument();
  });

  it('devrait afficher un indicateur de chargement pendant le chargement', () => {
    renderWithProviders(<TodoListPage />);
    expect(screen.getByText(/Chargement des tâches/i)).toBeInTheDocument();
  });

  it('devrait afficher la liste des tâches après chargement', async () => {
    renderWithProviders(<TodoListPage />);

    await waitFor(() => {
      expect(screen.queryByText(/Chargement des tâches/i)).not.toBeInTheDocument();
    });
    
    expect(screen.getByText('Tâche de test 1')).toBeInTheDocument();
    expect(screen.getByText('Tâche de test 2')).toBeInTheDocument();
    expect(screen.getByText('Tâche de test 3')).toBeInTheDocument();
  });

  it('devrait afficher un message si aucune tâche n\'est disponible', async () => {

    mockTodoService.getAllTodos.mockResolvedValue([]);
    
    renderWithProviders(<TodoListPage />);
    
    await waitFor(() => {
      expect(screen.queryByText(/Chargement des tâches/i)).not.toBeInTheDocument();
    });
    
    expect(screen.getByText(/Aucune tâche pour le moment/i)).toBeInTheDocument();
  });

  it('devrait afficher un message d\'erreur en cas d\'échec du chargement', async () => {

    mockTodoService.getAllTodos.mockRejectedValue(new Error('Erreur réseau'));
    
    renderWithProviders(<TodoListPage />);
    
    await waitFor(() => {
      expect(screen.queryByText(/Chargement des tâches/i)).not.toBeInTheDocument();
    });
    
    expect(screen.getByText(/Impossible de charger les tâches/i)).toBeInTheDocument();
  });

  it('devrait supprimer une tâche lorsqu\'on clique sur le bouton supprimer', async () => {
    renderWithProviders(<TodoListPage />);
    
    await waitFor(() => {
      expect(screen.queryByText(/Chargement des tâches/i)).not.toBeInTheDocument();
    });
    
    const deleteButtons = screen.getAllByText('Supprimer');
    
    fireEvent.click(deleteButtons[0]);
    
    expect(mockTodoService.deleteTodo).toHaveBeenCalledWith(mockTodos[0].id);
  });

  it('devrait basculer l\'état de complétion d\'une tâche lorsqu\'on coche la case', async () => {
    renderWithProviders(<TodoListPage />);
    
    await waitFor(() => {
      expect(screen.queryByText(/Chargement des tâches/i)).not.toBeInTheDocument();
    });
 
    const checkboxes = screen.getAllByRole('checkbox');
    
    fireEvent.click(checkboxes[0]);
    
    expect(mockTodoService.toggleTodoCompletion).toHaveBeenCalledWith(mockTodos[0].id, true);
  });

  it('devrait avoir un lien pour ajouter une nouvelle tâche', () => {
    renderWithProviders(<TodoListPage />);
    
    const addButton = screen.getByText(/Ajouter une tâche/i);
    expect(addButton).toBeInTheDocument();
    expect(addButton.getAttribute('href')).toBe('/add');
  });
});
