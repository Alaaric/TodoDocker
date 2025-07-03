import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TodoItem from '../components/Todo';
import { Todo } from '../services/todoServiceInterface';
import { useTodoService } from '../hooks/useTodoService';

const TodoListPage = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const todoService = useTodoService();

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const data = await todoService.getAllTodos();
        setTodos(data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors de la récupération des tâches:', err);
        setError('Impossible de charger les tâches. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, [todoService]);

  const handleDelete = async (id: number) => {
    try {
      await todoService.deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError('Impossible de supprimer la tâche. Veuillez réessayer.');
    }
  };

  const handleToggle = async (id: number) => {
    try {
      const todoToUpdate = todos.find(t => t.id === id);
      if (!todoToUpdate) return;
      
      const newCompletedState = !todoToUpdate.completed;
      const updatedTodo = await todoService.toggleTodoCompletion(id, newCompletedState);
      
      setTodos(todos.map(t => t.id === id ? updatedTodo : t));
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      setError('Impossible de mettre à jour la tâche.');
    }
  };

  return (
    <>
      <div className="todo-container">
        <h1>TODO LIST</h1>
        <Link to="/add" className="add-button">Ajouter une tâche</Link>
        
        {loading ? (
          <div className="loading">Chargement des tâches...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="todo-list">
            {todos.length === 0 ? (
              <p className="no-tasks">Aucune tâche pour le moment</p>
            ) : (
              todos.map(todo => (
                <TodoItem 
                  key={todo.id}
                  id={todo.id}
                  title={todo.title}
                  completed={todo.completed}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default TodoListPage;
