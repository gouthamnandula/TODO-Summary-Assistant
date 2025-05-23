import React from "react";

function TODOList({ todos, toggleComplete, deleteTodo, startEdit }) {
  return (
    <ol>
      {todos.length === 0 && <p>No todos yet!</p>}
      {todos.map((todo) => (
        <li key={todo.id} style={{ marginBottom: "10px" }}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleComplete(todo.id)}
          />
          {todo.editing ? (
            <input
              type="text"
              value={todo.title}
              onChange={(e) => startEdit(todo.id, e.target.value)}
              onBlur={() => startEdit(todo.id, todo.title, false)}
              autoFocus
            />
          ) : (
            <span
              onDoubleClick={() => startEdit(todo.id, todo.title, true)}
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
                cursor: "pointer",
              }}
            >
              {todo.title}
            </span>
          )}
          <button onClick={() => deleteTodo(todo.id)} style={{ marginLeft: 10 }}>
            Delete
          </button>
        </li>
      ))}
    </ol>
  );
}

export default TODOList;
