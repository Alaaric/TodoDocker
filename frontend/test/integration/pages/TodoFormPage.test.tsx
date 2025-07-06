import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import TodoFormPage from '../../../src/pages/TodoFormPage';
import { TodoServiceProvider } from '../../../src/context/TodoServiceContext';

const mockNavigate = vi.fn();
const mockTodoById = {
  id: 1,
  title: 'Tâche à modifier',
  completed: true
};

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...(actual as Record<string, unknown>),
    useNavigate: () => mockNavigate,
  };
});

const mockTodoService = {
  getAllTodos: vi.fn(),
  getTodoById: vi.fn().mockResolvedValue(mockTodoById),
  createTodo: vi.fn().mockImplementation((todoData) => Promise.resolve({ id: 999, ...todoData })),
  updateTodo: vi.fn().mockImplementation((id, todoData) => Promise.resolve({ id, ...todoData })),
  deleteTodo: vi.fn(),
  toggleTodoCompletion: vi.fn()
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

const renderWithRouter = (path: string) => {
  return render(
    <TodoServiceProvider service={mockTodoService}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/" element={<div>Home</div>} />
          <Route path="/add" element={<TodoFormPage />} />
          <Route path="/edit/:id" element={<TodoFormPage />} />
        </Routes>
      </MemoryRouter>
    </TodoServiceProvider>
  );
};

describe('TodoFormPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Mode ajout', () => {
    it('devrait afficher "Ajouter une nouvelle tâche" comme titre', () => {
      renderWithProviders(<TodoFormPage />);
      expect(screen.getByText('Ajouter une nouvelle tâche')).toBeInTheDocument();
    });

    it('devrait avoir un formulaire vide', () => {
      renderWithProviders(<TodoFormPage />);
      
      const titleInput = screen.getByLabelText('Titre') as HTMLInputElement;
      const completedCheckbox = screen.getByLabelText('Terminée') as HTMLInputElement;
      
      expect(titleInput.value).toBe('');
      expect(completedCheckbox.checked).toBe(false);
    });

    it('devrait appeler createTodo lors de la soumission du formulaire', async () => {
      renderWithProviders(<TodoFormPage />);
      
      const titleInput = screen.getByLabelText('Titre');
      const completedCheckbox = screen.getByLabelText('Terminée');
      const submitButton = screen.getByText('Sauvegarder');
      
      fireEvent.change(titleInput, { target: { value: 'Nouvelle tâche' } });
      fireEvent.click(completedCheckbox);
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockTodoService.createTodo).toHaveBeenCalledWith({
          title: 'Nouvelle tâche',
          completed: true
        });
      });
      
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  describe('Mode édition', () => {
    it('devrait afficher "Modifier la tâche" comme titre', async () => {
      renderWithRouter('/edit/1');
      
      await waitFor(() => {
        expect(screen.getByText('Modifier la tâche')).toBeInTheDocument();
      });
    });

    it('devrait charger les données de la tâche existante', async () => {
      renderWithRouter('/edit/1');
      
      await waitFor(() => {
        expect(mockTodoService.getTodoById).toHaveBeenCalledWith('1');
      });
      
      const titleInput = screen.getByLabelText('Titre') as HTMLInputElement;
      const completedCheckbox = screen.getByLabelText('Terminée') as HTMLInputElement;
      
      expect(titleInput.value).toBe('Tâche à modifier');
      expect(completedCheckbox.checked).toBe(true);
    });

    it('devrait appeler updateTodo lors de la soumission du formulaire', async () => {
      renderWithRouter('/edit/1');
      
      await waitFor(() => {
        const titleInput = screen.getByLabelText('Titre') as HTMLInputElement;
        expect(titleInput.value).toBe('Tâche à modifier');
      });
      
      const titleInput = screen.getByLabelText('Titre');
      const submitButton = screen.getByText('Sauvegarder');
      
      fireEvent.change(titleInput, { target: { value: 'Tâche modifiée' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockTodoService.updateTodo).toHaveBeenCalledWith('1', {
          title: 'Tâche modifiée',
          completed: true
        });
      });
      
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('devrait afficher un message de chargement pendant la récupération des données', async () => {

      mockTodoService.getTodoById.mockImplementationOnce(() => new Promise(resolve => {
        setTimeout(() => resolve(mockTodoById), 100);
      }));
      
      renderWithRouter('/edit/1');
      
      expect(screen.getByText('Chargement des données...')).toBeInTheDocument();
      
      await waitFor(() => {
        expect(screen.queryByText('Chargement des données...')).not.toBeInTheDocument();
      });
    });

    it('devrait afficher une erreur si la récupération des données échoue', async () => {
      mockTodoService.getTodoById.mockRejectedValueOnce(new Error('Erreur réseau'));
      
      renderWithRouter('/edit/1');
      
      await waitFor(() => {
        expect(screen.getByText('Impossible de charger les détails de la tâche')).toBeInTheDocument();
      });
    });
  });

  it('devrait avoir un bouton annuler qui renvoie à la page d\'accueil', () => {
    renderWithProviders(<TodoFormPage />);
    
    const cancelButton = screen.getByText('Annuler');
    expect(cancelButton.getAttribute('href')).toBe('/');
  });

  it('devrait désactiver le bouton de sauvegarde pendant le chargement', async () => {

    mockTodoService.createTodo.mockImplementationOnce(() => new Promise(resolve => {
      setTimeout(() => resolve({ id: 999, title: 'test', completed: false }), 100);
    }));
    
    renderWithProviders(<TodoFormPage />);
    
    const titleInput = screen.getByLabelText('Titre');
    const submitButton = screen.getByText('Sauvegarder');
    
    fireEvent.change(titleInput, { target: { value: 'Test' } });
    fireEvent.click(submitButton);
    
    expect(screen.getByText('Sauvegarde en cours...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('devrait afficher une erreur si la sauvegarde échoue', async () => {
    mockTodoService.createTodo.mockRejectedValueOnce(new Error('Erreur serveur'));
    
    renderWithProviders(<TodoFormPage />);
    
    const titleInput = screen.getByLabelText('Titre');
    const submitButton = screen.getByText('Sauvegarder');
    
    fireEvent.change(titleInput, { target: { value: 'Test' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Erreur lors de la sauvegarde de la tâche. Veuillez réessayer.')).toBeInTheDocument();
    });
  });
});
