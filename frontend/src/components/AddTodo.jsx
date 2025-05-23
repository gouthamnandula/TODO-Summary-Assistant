import React, { useState } from "react";

function AddTodo({ addTodo }) {
  const [title, setTitle] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    if (title.trim() === "") return;
    addTodo(title.trim());
    setTitle("");
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Add new todo"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button type="submit">Add</button>
    </form>
  );
}

export default AddTodo;
