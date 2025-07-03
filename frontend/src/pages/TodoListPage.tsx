import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TodoItem from '../components/Todo';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const TodoListPage = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://localhost:8000/api/todos', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
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
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`https://localhost:8000/api/todos/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError('Impossible de supprimer la tâche. Veuillez réessayer.');
      // On pourrait ajouter un système de notification ici
    }
  };

  const handleToggle = async (id: number) => {
    try {
      const todoToUpdate = todos.find(t => t.id === id);
      if (!todoToUpdate) return;
      
      const updatedTodo = { ...todoToUpdate, completed: !todoToUpdate.completed };
      
      const response = await fetch(`https://localhost:8000/api/todos/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ completed: !todoToUpdate.completed }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      setTodos(todos.map(t => t.id === id ? updatedTodo : t));
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      setError('Impossible de mettre à jour la tâche.');
    }
  };

  return (
    <>
      <div className="todo-container">
        <h1>Ma Liste de Tâches</h1>
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
