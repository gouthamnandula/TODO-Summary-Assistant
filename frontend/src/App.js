import './App.css';
import React, { useEffect, useState } from "react";
import TODOList from "./components/TODOList";
import AddTodo from "./components/AddTodo";

function App() {
  const [todos, setTodos] = useState([]);

  // Fetch todos from backend
  const fetchTodos = async () => {
    const res = await fetch("/todos");
    const data = await res.json();
    setTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (title) => {
    const res = await fetch("/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (res.ok) fetchTodos();
  };

  const toggleComplete = async (id) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    await fetch(`/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !todo.completed }),
    });
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await fetch(`/todos/${id}`, { method: "DELETE" });
    fetchTodos();
  };

  const startEdit = async (id, title, editing = true) => {
    if (!editing) {
      // Save edit
      await fetch(`/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      fetchTodos();
    } else {
      // Set editing state locally
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, editing: true } : todo
        )
      );
    }
  };

  const summarizeAndSend = async () => {
    const res = await fetch("/summarize", { method: "POST" });
    const data = await res.json();
    alert(data.message);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Todo Summary Assistant</h1>
      <AddTodo addTodo={addTodo} />
      <TODOList
        todos={todos}
        toggleComplete={toggleComplete}
        deleteTodo={deleteTodo}
        startEdit={startEdit}
      />
      <button onClick={summarizeAndSend} style={{ marginTop: 20 }}>
        Summarize & Send to Slack
      </button>
    </div>
  );
}

export default App;
