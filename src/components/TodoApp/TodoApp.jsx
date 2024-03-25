import "./TodoApp.css";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  setDoc,
  query,
  getDocs,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { v4 as uuidv4 } from "uuid";

export default function TodoApp({ userId }) {
  const [todoList, setTodoList] = useState([]);
  const [task, setTask] = useState("");
  const [editTask, setEditTask] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      if (userId) {
        // Create a reference to the user's todos collection
        const todosCollection = collection(db, "users", userId, "todos");

        // Query the todos collection to get all documents
        const todosQuery = query(todosCollection);

        try {
          // Fetch the documents from the todos collection
          const snapshot = await getDocs(todosQuery);

          // Extract data from the documents and update state
          const todosData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          // using to toSorted instead of sort for avoiding mutation of the original array
          const sortedTodos = todosData.toSorted(
            (a, b) => b.created - a.created
          );
          console.log(`todos of ${userId}`);
          setTodoList(sortedTodos);
        } catch (error) {
          alert("Error fetching todos: ", error);
        }
      } else {
        console.log("User is not logged in, Can't fetch the todos!");
        setTodoList([]);
      }
    };

    fetchTodos();
  }, [userId]);

  async function addTodo() {
    if (task && userId) {
      try {
        const todoID = uuidv4();
        const usersCollection = collection(db, "users");
        const userDocRef = doc(usersCollection, userId);

        const userTodosCollection = collection(userDocRef, "todos");
        const todoDocRef = doc(userTodosCollection, todoID);

        const todoData = {
          id: todoID,
          task,
          isFinished: false,
          editInput: false,
          created: Date.now(),
        };

        setDoc(todoDocRef, todoData)
          .then(() => {
            console.log(
              "todo document written successfully! ID:",
              todoDocRef.id
            );
          })
          .catch((error) => {
            console.error("Error writing todo document: ", error);
          });

        // console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    } else {
      alert("User ID is undefined.");
    }
  }

  function addTodoOnEnterKey(e) {
    if (e.key === "Enter" || e.keyCode === 13 || e.which === 13) {
      addTodo();
    }
  }

  function deleteTodo(id) {
    // deleting todo from firestore
    if (userId) {
      const usersCollection = collection(db, "users");
      const userDocRef = doc(usersCollection, userId);
      const userTodosCollection = collection(userDocRef, "todos");
      const todoDocRef = doc(userTodosCollection, id);
      deleteDoc(todoDocRef)
        .then(() => {
          console.log("todo document deleted successfully! ID: ", id);
        })
        .catch((error) => {
          console.error("Error deleting todo document: ", error);
        });
    }
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
      // setTodoList((prevTodoList) => {
      //   return prevTodoList.map((todo) => {
      //     if (todo.id === id) {
      //       return {
      //         ...todo,
      //         task: editTask,
      //         editInput: false,
      //       };
      //     }
      //     return todo;
      //   });
      // });
      // setEditTask("");

      // updating todo in firestore
      if (userId) {
        const usersCollection = collection(db, "users");
        const userDocRef = doc(usersCollection, userId);
        const userTodosCollection = collection(userDocRef, "todos");
        const todoDocRef = doc(userTodosCollection, id);
        updateDoc(todoDocRef, { task: editTask })
          .then(() => {
            console.log("todo document updated successfully! ID: ", id);
          })
          .catch((error) => {
            console.error("Error updating todo document: ", error);
          });
      }
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
