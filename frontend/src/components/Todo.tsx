import { Link } from 'react-router-dom';

interface TodoItemProps {
  id: number;
  title: string;
  completed: boolean;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const TodoItem = ({ id, title, completed, onToggle, onDelete }: TodoItemProps) => {
  return (
    <div className={`todo-item ${completed ? "completed" : ""}`}>
      <span className="todo-title">
        <input 
          type="checkbox" 
          checked={completed}
          onChange={() => onToggle(id)}
        />
        {title}
      </span>
      <div className="todo-actions">
        <Link to={`/edit/${id}`} className="edit-button">Modifier</Link>
        <button onClick={() => onDelete(id)} className="delete-button">Supprimer</button>
      </div>
    </div>
  );
};

export default TodoItem;
