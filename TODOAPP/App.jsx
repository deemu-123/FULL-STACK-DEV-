import React, { useState, useEffect } from "react";
import "./index.css";

function App() {
  const [task, setTask] = useState("");

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (task.trim() === "") return;

    setTasks([...tasks, task]);
    setTask("");
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div className="container">

      <div className="todo-card">

        <h1>📝 React ToDo App</h1>

        <p>Organize your tasks and get things done!</p>

        <div className="input-box">

          <input
            type="text"
            placeholder="Enter Task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />

          <button onClick={addTask}>
            Add +
          </button>

        </div>

        <ul>

          {tasks.map((item, index) => (

            <li key={index}>

              <span>{item}</span>

              <button
                className="delete-btn"
                onClick={() => deleteTask(index)}
              >
                Delete
              </button>

            </li>

          ))}

        </ul>

      </div>

    </div>
  );
}

export default App;
