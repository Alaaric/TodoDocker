import { Todo, TodoInput, TodoManagement } from './todoServiceInterface';

const API_URL = 'https://localhost:8000/api';

const defaultOptions = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  credentials: 'include' as RequestCredentials,
};

export class TodoService implements TodoManagement {
  async getAllTodos(): Promise<Todo[]> {
    const response = await fetch(`${API_URL}/todos`, {
      ...defaultOptions,
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return await response.json();
  }

  async getTodoById(id: number | string): Promise<Todo> {
    const response = await fetch(`${API_URL}/todos/${id}`, {
      ...defaultOptions,
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return await response.json();
  }

  async createTodo(todoData: TodoInput): Promise<Todo> {
    const response = await fetch(`${API_URL}/todos`, {
      ...defaultOptions,
      method: 'POST',
      body: JSON.stringify(todoData),
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return await response.json();
  }

  async updateTodo(id: number | string, todoData: Partial<TodoInput>): Promise<Todo> {
    const response = await fetch(`${API_URL}/todos/${id}`, {
      ...defaultOptions,
      method: 'PUT',
      body: JSON.stringify(todoData),
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return await response.json();
  }

  async deleteTodo(id: number | string): Promise<void> {
    const response = await fetch(`${API_URL}/todos/${id}`, {
      ...defaultOptions,
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
  }

  async toggleTodoCompletion(id: number | string, completed: boolean): Promise<Todo> {
    return this.updateTodo(id, { completed });
  }
}

// Instance par défaut du service Todo
export const todoService = new TodoService();
