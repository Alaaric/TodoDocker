import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./css/App.css";
import TodoListPage from "./pages/TodoListPage";
import TodoFormPage from "./pages/TodoFormPage";
import ThemeToggle from "./components/ThemeToggle";
import { TodoServiceProvider } from "./context/TodoServiceContext";
import { todoService } from "./services/todoService";

function App() {
  return (
    <TodoServiceProvider service={todoService}>
      <BrowserRouter>
        <div className="app">
          <Routes>
            <Route path="/" element={<TodoListPage />} />
            <Route path="/add" element={<TodoFormPage />} />
            <Route path="/edit/:id" element={<TodoFormPage />} />
          </Routes>
          <ThemeToggle />
        </div>
      </BrowserRouter>
    </TodoServiceProvider>
  );
}

export default App;
