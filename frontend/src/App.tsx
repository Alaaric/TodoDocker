import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./css/App.css";
import TodoListPage from "./pages/TodoListPage";
import TodoFormPage from "./pages/TodoFormPage";
import ThemeToggle from "./components/ThemeToggle";

function App() {
  return (
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
  );
}

export default App;
