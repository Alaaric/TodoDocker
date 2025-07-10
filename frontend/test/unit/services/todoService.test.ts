import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TodoService } from '../../../src/services/todoService';
import { Todo, TodoInput } from '../../../src/services/todoServiceInterface';

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('TodoService', () => {
  let todoService: TodoService;
  const mockTodo: Todo = { id: 1, title: 'Test Todo', completed: false };
  const mockTodos: Todo[] = [
    mockTodo,
    { id: 2, title: 'Test Todo 2', completed: true }
  ];
  const mockInput: TodoInput = { title: 'New Todo', completed: false };

  beforeEach(() => {
    todoService = new TodoService();
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function mockSuccessResponse(data: unknown) {
    const mockResponse = {
      ok: true,
      json: async () => data,
      status: 200
    };
    mockFetch.mockResolvedValue(mockResponse);
  }

  function mockErrorResponse(status = 500) {
    const mockResponse = {
      ok: false,
      status
    };
    mockFetch.mockResolvedValue(mockResponse);
  }

  describe('getAllTodos', () => {
    it('devrait récupérer tous les todos', async () => {
      mockSuccessResponse(mockTodos);
      
      const result = await todoService.getAllTodos();
      
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/todos', expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        })
      }));
      expect(result).toEqual(mockTodos);
    });

    it('devrait lancer une erreur si la requête échoue', async () => {
      mockErrorResponse(404);
      
      await expect(todoService.getAllTodos()).rejects.toThrow('Erreur HTTP: 404');
    });
  });

  describe('getTodoById', () => {
    it('devrait récupérer un todo par son ID', async () => {
      mockSuccessResponse(mockTodo);
      
      const result = await todoService.getTodoById(1);
      
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/todos/1', expect.any(Object));
      expect(result).toEqual(mockTodo);
    });

    it('devrait lancer une erreur si la requête échoue', async () => {
      mockErrorResponse(404);
      
      await expect(todoService.getTodoById(999)).rejects.toThrow('Erreur HTTP: 404');
    });
  });

  describe('createTodo', () => {
    it('devrait créer un nouveau todo', async () => {
      const createdTodo = { ...mockInput, id: 3 };
      mockSuccessResponse(createdTodo);
      
      const result = await todoService.createTodo(mockInput);
      
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/todos', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(mockInput)
      }));
      expect(result).toEqual(createdTodo);
    });

    it('devrait lancer une erreur si la requête échoue', async () => {
      mockErrorResponse(400);
      
      await expect(todoService.createTodo(mockInput)).rejects.toThrow('Erreur HTTP: 400');
    });
  });

  describe('updateTodo', () => {
    it('devrait mettre à jour un todo existant', async () => {
      const updatedTodo = { ...mockTodo, title: 'Updated Title' };
      mockSuccessResponse(updatedTodo);
      
      const result = await todoService.updateTodo(1, { title: 'Updated Title' });
      
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/todos/1', expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({ title: 'Updated Title' })
      }));
      expect(result).toEqual(updatedTodo);
    });

    it('devrait lancer une erreur si la requête échoue', async () => {
      mockErrorResponse(404);
      
      await expect(todoService.updateTodo(999, { title: 'Test' })).rejects.toThrow('Erreur HTTP: 404');
    });
  });

  describe('deleteTodo', () => {
    it('devrait supprimer un todo', async () => {
      mockSuccessResponse({});
      
      await todoService.deleteTodo(1);
      
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/todos/1', expect.objectContaining({
        method: 'DELETE'
      }));
    });

    it('devrait lancer une erreur si la requête échoue', async () => {
      mockErrorResponse(404);
      
      await expect(todoService.deleteTodo(999)).rejects.toThrow('Erreur HTTP: 404');
    });
  });

  describe('toggleTodoCompletion', () => {
    it('devrait appeler updateTodo avec le paramètre completed', async () => {
      const updatedTodo = { ...mockTodo, completed: true };
      mockSuccessResponse(updatedTodo);
      
      const result = await todoService.toggleTodoCompletion(1, true);
      
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/todos/1', expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({ completed: true })
      }));
      expect(result).toEqual(updatedTodo);
    });
  });
});
