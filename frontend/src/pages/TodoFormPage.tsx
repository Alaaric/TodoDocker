import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { todoService, TodoInput } from '../services/todoService';

const TodoFormPage = () => {
  const [title, setTitle] = useState("");
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const params = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEditing = params.id !== undefined;
  
  useEffect(() => {
    if (isEditing && params.id) {
      const fetchTodo = async () => {
        try {
          setLoading(true);
          const todoData = await todoService.getTodoById(params.id as string);
          setTitle(todoData.title);
          setCompleted(todoData.completed);
        } catch (err) {
          console.error('Erreur lors de la récupération de la tâche:', err);
          setError('Impossible de charger les détails de la tâche');
          
          setTitle("Tâche à modifier (erreur de chargement)");
          setCompleted(false);
        } finally {
          setLoading(false);
        }
      };
      
      fetchTodo();
    }
  }, [isEditing, params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const todoData: TodoInput = { title, completed };
      
      if (isEditing && params.id) {
        await todoService.updateTodo(params.id as string, todoData);
      } else {
        await todoService.createTodo(todoData);
      }
      
      navigate('/');
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      setError('Erreur lors de la sauvegarde de la tâche. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="form-container">
        <h1>{isEditing ? "Modifier la tâche" : "Ajouter une nouvelle tâche"}</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        {loading && isEditing ? (
          <div className="loading">Chargement des données...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Titre</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
            <div className="form-group checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={completed}
                  onChange={(e) => setCompleted(e.target.checked)}
                  disabled={loading}
                />
                Terminée
              </label>
            </div>
            
            <div className="form-actions">
              <Link to="/" className="cancel-button">Annuler</Link>
              <button 
                type="submit" 
                className="save-button"
                disabled={loading}
              >
                {loading ? "Sauvegarde en cours..." : "Sauvegarder"}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default TodoFormPage;
