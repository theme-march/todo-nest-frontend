import { useEffect, useState } from "react";
import { api } from "./api";
import "./index.css";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Load Todos From API
  const loadTodos = async () => {
    try {
      setLoading(true);
      const res = await api.get("/todos");
      setTodos(res.data);
    } catch (err) {
      console.error("Failed to load todos:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create Todo
  const addTodo = async () => {
    if (!input.trim()) return;
    try {
      await api.post("/todos", { title: input.trim() });
      setInput("");
      loadTodos();
    } catch (err) {
      console.error("Failed to create todo:", err);
    }
  };

  // Toggle Completed
  const toggleTodo = async (todo) => {
    try {
      await api.patch(`/todos/${todo.id}`, {
        completed: !todo.completed,
      });
      loadTodos();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  // Delete Todo
  const deleteTodo = async (id) => {
    try {
      await api.delete(`/todos/${id}`);
      loadTodos();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") addTodo();
  };

  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <div className="app">
      <div className="todo-card">
        <h1 className="title">📝 Todo List</h1>

        <div className="input-row">
          <input
            className="input"
            placeholder="নতুন কাজ লিখুন..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="btn" onClick={addTodo}>
            Add
          </button>
        </div>

        {loading && <p className="loading">লোড হচ্ছে...</p>}

        <ul className="list">
          {todos.map((todo) => (
            <li className="item" key={todo.id}>
              <button
                className={`check ${todo.completed ? "checked" : ""}`}
                onClick={() => toggleTodo(todo)}
              >
                {todo.completed && "✓"}
              </button>

              <span
                className={`text ${todo.completed ? "done" : ""}`}
                onClick={() => toggleTodo(todo)}
              >
                {todo.title}
              </span>

              <button className="del-btn" onClick={() => deleteTodo(todo.id)}>
                ×
              </button>
            </li>
          ))}

          {!loading && todos.length === 0 && (
            <p className="empty">কোনো কাজ নেই 🙂</p>
          )}
        </ul>
      </div>
    </div>
  );
}
