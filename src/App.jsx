import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Header from "./components/Header/Header";
import TodoApp from "./components/TodoApp/TodoApp";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

export default function App() {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUserId(uid);
        const name = user.email.split("@")[0];
        setUsername(name);
        // ...
      } else {
        // User is signed out
      }
    });
  }, []);

  return (
    <>
      <Header username={username} />
      <TodoApp userId={userId} />
    </>
  );
}
