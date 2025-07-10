import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TodoItem from '../../../src/components/Todo';

describe('TodoItem', () => {
  const mockProps = {
    id: 1,
    title: 'Tâche de test',
    completed: false,
    onToggle: vi.fn(),
    onDelete: vi.fn(),
  };

  it('devrait afficher le titre de la tâche correctement', () => {
    render(
      <BrowserRouter>
        <TodoItem {...mockProps} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Tâche de test')).toBeInTheDocument();
  });

  it('devrait afficher une case à cocher non cochée pour une tâche non terminée', () => {
    render(
      <BrowserRouter>
        <TodoItem {...mockProps} />
      </BrowserRouter>
    );
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('devrait afficher une case à cocher cochée pour une tâche terminée', () => {
    render(
      <BrowserRouter>
        <TodoItem {...mockProps} completed={true} />
      </BrowserRouter>
    );
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('devrait ajouter la classe CSS "completed" lorsque la tâche est terminée', () => {
    render(
      <BrowserRouter>
        <TodoItem {...mockProps} completed={true} />
      </BrowserRouter>
    );
    
    const todoItem = screen.getByText('Tâche de test').closest('.todo-item');
    expect(todoItem).toHaveClass('completed');
  });

  it('devrait appeler onToggle lorsque la case à cocher est cliquée', () => {
    render(
      <BrowserRouter>
        <TodoItem {...mockProps} />
      </BrowserRouter>
    );
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockProps.onToggle).toHaveBeenCalledWith(mockProps.id);
  });

  it('devrait appeler onDelete lorsque le bouton supprimer est cliqué', () => {
    render(
      <BrowserRouter>
        <TodoItem {...mockProps} />
      </BrowserRouter>
    );
    
    const deleteButton = screen.getByText('Supprimer');
    fireEvent.click(deleteButton);
    
    expect(mockProps.onDelete).toHaveBeenCalledWith(mockProps.id);
  });

  it('devrait avoir un lien de modification avec l\'URL correcte', () => {
    render(
      <BrowserRouter>
        <TodoItem {...mockProps} />
      </BrowserRouter>
    );
    
    const editLink = screen.getByText('Modifier');
    expect(editLink.getAttribute('href')).toBe('/edit/1');
  });
});
