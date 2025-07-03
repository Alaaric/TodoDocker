export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export interface TodoInput {
  title: string;
  completed: boolean;
}

export interface TodoManagement {
  getAllTodos(): Promise<Todo[]>;
  getTodoById(id: number | string): Promise<Todo>;
  createTodo(todoData: TodoInput): Promise<Todo>;
  updateTodo(id: number | string, todoData: Partial<TodoInput>): Promise<Todo>;
  deleteTodo(id: number | string): Promise<void>;
  toggleTodoCompletion(id: number | string, completed: boolean): Promise<Todo>;
}
