import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

function App() {

  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");


  // ---------------------------------------
  // GET TASKS
  // ---------------------------------------

  const fetchTasks = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/tasks/`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();

      setTasks(data);

    } catch (error) {

      setError(error.message);

    } finally {

      setLoading(false);

    }
  };


  // ---------------------------------------
  // LOAD TASKS WHEN PAGE OPENS
  // ---------------------------------------

  useEffect(() => {

    fetchTasks();

  }, []);


  // ---------------------------------------
  // CREATE TASK
  // ---------------------------------------

  const addTask = async (event) => {

    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    try {

      const response = await fetch(
        `${API_URL}/tasks/`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            title: title,
            description: description
          })
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      const newTask = await response.json();

      setTasks((currentTasks) => [
        ...currentTasks,
        newTask
      ]);

      setTitle("");

      setDescription("");

    } catch (error) {

      setError(error.message);

    }
  };


  // ---------------------------------------
  // TOGGLE COMPLETED
  // ---------------------------------------

  const toggleTask = async (task) => {

    try {

      const response = await fetch(
        `${API_URL}/tasks/${task.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            title: task.title,
            description: task.description,
            completed: !task.completed
          })
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      const updatedTask = await response.json();

      setTasks((currentTasks) =>
        currentTasks.map((item) =>
          item.id === updatedTask.id
            ? updatedTask
            : item
        )
      );

    } catch (error) {

      setError(error.message);

    }
  };


  // ---------------------------------------
  // DELETE TASK
  // ---------------------------------------

  const deleteTask = async (taskId) => {

    try {

      const response = await fetch(
        `${API_URL}/tasks/${taskId}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      setTasks((currentTasks) =>
        currentTasks.filter(
          (task) => task.id !== taskId
        )
      );

    } catch (error) {

      setError(error.message);

    }
  };


  return (

    <div className="container">

      <h1>Task Manager</h1>

      <p className="subtitle">
        React + FastAPI + MySQL
      </p>


      {/* ERROR */}

      {error && (
        <div className="error">
          {error}
        </div>
      )}


      {/* ADD TASK */}

      <form
        className="task-form"
        onSubmit={addTask}
      >

        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(event) =>
            setTitle(event.target.value)
          }
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
        />

        <button type="submit">
          Add Task
        </button>

      </form>


      {/* TASK LIST */}

      <h2>My Tasks</h2>


      {loading ? (

        <p>Loading tasks...</p>

      ) : tasks.length === 0 ? (

        <p>No tasks found.</p>

      ) : (

        <div className="task-list">

          {tasks.map((task) => (

            <div
              className={`task ${
                task.completed
                  ? "completed"
                  : ""
              }`}
              key={task.id}
            >

              <div className="task-info">

                <h3>
                  {task.title}
                </h3>

                <p>
                  {task.description}
                </p>

              </div>


              <div className="actions">

                <button
                  onClick={() =>
                    toggleTask(task)
                  }
                >
                  {task.completed
                    ? "Undo"
                    : "Complete"}
                </button>


                <button
                  className="delete"
                  onClick={() =>
                    deleteTask(task.id)
                  }
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default App;