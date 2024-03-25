import "./TodoApp.css";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function TodoApp() {
  const [task, setTask] = useState("");
  const [editTask, setEditTask] = useState("");
  const [todoList, setTodoList] = useState(
    JSON.parse(localStorage.getItem("todoList")) || []
  );

  useEffect(() => {
    localStorage.setItem("todoList", JSON.stringify(todoList));
  }, [todoList]);

  function addTodo() {
    if (task) {
      setTodoList((prevTodoList) => {
        return [
          ...prevTodoList,
          { id: uuidv4(), task, isFinished: false, editInput: false },
        ];
      });
      setTask("");
    }
  }

  function addTodoOnEnterKey(e) {
    if (e.key === "Enter" || e.keyCode === 13 || e.which === 13) {
      addTodo();
    }
  }

  function deleteTodo(id) {
    setTodoList((prevTodoList) => {
      return prevTodoList.filter((todo) => {
        if (todo.id !== id) {
          return todo;
        }
      });
    });
  }

  function toggleLineThrough(id) {
    setTodoList((prevTodoList) => {
      return prevTodoList.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            isFinished: !todo.isFinished,
          };
        } else {
          return todo;
        }
      });
    });
  }

  function clearAllTodos() {
    setTodoList([]);
  }

  function toggleEditTodo(id) {
    setTodoList((prevTodoList) => {
      return prevTodoList.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            editInput: !todo.editInput,
          };
        }
        return todo;
      });
    });
  }

  function saveEditedTodo(id) {
    if (editTask) {
      setTodoList((prevTodoList) => {
        return prevTodoList.map((todo) => {
          if (todo.id === id) {
            return {
              ...todo,
              task: editTask,
              editInput: false,
            };
          }
          return todo;
        });
      });
      setEditTask("");
    }
  }

  function saveEditedTodoOnEnterKey(e, id) {
    if (e.key === "Enter" || e.keyCode === 13 || e.which === 13) {
      saveEditedTodo(id);
    }
  }

  const todosElements = todoList.map((todo) => {
    return (
      <div key={todo.id} className="todo-task-element">
        <div className="todo-task">
          <div
            className="todo-item"
            onClick={() => toggleLineThrough(todo.id)}
            style={{ textDecoration: todo.isFinished ? "line-through" : "" }}
          >
            {!todo.editInput && todo.task}
            {todo.editInput && (
              <div>
                <input
                  type="text"
                  placeholder="edit task..."
                  className="edit-todo-input"
                  onChange={(e) => setEditTask(e.target.value)}
                  onKeyDown={(e) => saveEditedTodoOnEnterKey(e, todo.id)}
                  value={editTask}
                />
                <button
                  className="save-edit-btn"
                  onClick={() => saveEditedTodo(todo.id)}
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="todo-btns-del-edit">
          <button
            onClick={() => toggleEditTodo(todo.id)}
            className="todo-btn edit-btn"
          >
            {todo.editInput ? "Cancel" : "Edit"}
          </button>
          <button
            onClick={() => deleteTodo(todo.id)}
            className="todo-btn del-btn"
          >
            Delete
          </button>
        </div>
      </div>
    );
  });

  return (
    <main className="todo-app">
      <div>
        <input
          type="text"
          className="todo-input"
          placeholder="enter tasks..."
          name="task"
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={addTodoOnEnterKey}
          value={task}
        />
        <button onClick={addTodo} className="btn-enter">
          Enter
        </button>
        <button onClick={clearAllTodos} className="btn-clear">
          Clear All
        </button>
      </div>
      <div className="todo-list">{todosElements}</div>
    </main>
  );
}
